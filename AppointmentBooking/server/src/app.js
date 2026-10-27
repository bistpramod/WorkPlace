import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { config } from "./config/config.js";
import { setSession, COOKIE, requireAuth, requireAdmin } from "./auth.js";
import { User, Service, WorkingHours, Appointment } from "./models.js";
import { availableSlots, isOpenSlot } from "./slots.js";

export const app = express();
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.get("/api/health", (_q, res) =>
  res.json({ status: "ok", timezone: config.timezone }),
);
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    typeof password !== "string" ||
    password.length < 8
  )
    return res.status(400).json({
      message:
        "Enter a name, valid email, and password of at least 8 characters.",
    });
  try {
    const user = await User.create({
      name: name.trim(),
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "customer",
    });
    setSession(res, user);
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    throw error;
  }
});
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email || "").toLowerCase(),
  }).select("+passwordHash");
  if (
    !user ||
    !(await bcrypt.compare(String(password || ""), user.passwordHash))
  )
    return res.status(401).json({ message: "Incorrect email or password." });
  setSession(res, user);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});
app.post("/api/auth/logout", (_q, res) => {
  res.clearCookie(COOKIE, {
    httpOnly: true,
    secure: config.production,
    sameSite: config.production ? "none" : "lax",
  });
  res.status(204).end();
});
app.get("/api/auth/me", requireAuth, (req, res) =>
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  }),
);
app.get("/api/services", async (_q, res) =>
  res.json(await Service.find({ isActive: true }).sort({ name: 1 })),
);
app.get("/api/slots", async (req, res) =>
  res.json(await availableSlots(req.query.date)),
);
app.post("/api/appointments", requireAuth, async (req, res) => {
  try {
    const { serviceId, startAt } = req.body;
    if (
      !mongoose.isValidObjectId(serviceId) ||
      typeof startAt !== "string" ||
      !startAt.endsWith("Z")
    )
      return res.status(400).json({ message: "Invalid booking details." });
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service)
      return res.status(404).json({ message: "Service not found." });
    const starts = new Date(startAt);
    if (!(await isOpenSlot(starts)))
      return res
        .status(400)
        .json({ message: "That time is not a valid open slot." });
    const booking = await Appointment.create({
      customer: req.user.id,
      service: service.id,
      startAt: starts,
      endAt: new Date(starts.getTime() + 1800000),
    });
    res.status(201).json({ id: booking.id, status: booking.status });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "That slot was just booked. Pick another." });
    throw error;
  }
});
app.get("/api/appointments/mine", requireAuth, async (req, res) =>
  res.json(
    await Appointment.find({ customer: req.user.id })
      .populate("service", "name price")
      .sort({ startAt: 1 }),
  ),
);
app.patch("/api/appointments/:id/cancel", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: "Appointment not found." });
  const result = await Appointment.findOneAndUpdate(
    {
      _id: req.params.id,
      customer: req.user.id,
      status: "confirmed",
      startAt: { $gt: new Date() },
    },
    { $set: { status: "cancelled", blocksSlot: false } },
    { new: true },
  );
  if (!result)
    return res
      .status(404)
      .json({ message: "Active future appointment not found." });
  res.json(result);
});

const admin = [requireAuth, requireAdmin];
app.get("/api/admin/appointments", ...admin, async (req, res) => {
  const filter = {};
  if (req.query.date) {
    const day = new Date(`${req.query.date}T00:00:00.000Z`);
    if (!Number.isNaN(day.getTime()))
      filter.startAt = { $gte: day, $lt: new Date(day.getTime() + 86400000) };
  }
  res.json(
    await Appointment.find(filter)
      .populate("customer", "name email")
      .populate("service", "name")
      .sort({ startAt: 1 }),
  );
});
app.get("/api/admin/services", ...admin, async (_q, res) =>
  res.json(await Service.find().sort({ name: 1 })),
);
app.post("/api/admin/services", ...admin, async (req, res) => {
  const { name, description = "", price } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  )
    return res
      .status(400)
      .json({ message: "Name and a non-negative price are required." });
  res.status(201).json(
    await Service.create({
      name: name.trim(),
      description: String(description),
      price: Number(price),
    }),
  );
});
app.patch("/api/admin/services/:id", ...admin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: "Service not found." });
  const allowed = {};
  for (const key of ["name", "description", "price", "isActive"])
    if (req.body[key] !== undefined) allowed[key] = req.body[key];
  const service = await Service.findByIdAndUpdate(req.params.id, allowed, {
    new: true,
    runValidators: true,
  });
  if (!service) return res.status(404).json({ message: "Service not found." });
  res.json(service);
});
app.get("/api/admin/hours", ...admin, async (_q, res) =>
  res.json(await WorkingHours.find().sort({ weekday: 1 })),
);
app.put("/api/admin/hours/:weekday", ...admin, async (req, res) => {
  const weekday = Number(req.params.weekday),
    { openTime, closeTime, isClosed } = req.body;
  const pattern = /^([01]\d|2[0-3]):(00|30)$/;
  if (
    !Number.isInteger(weekday) ||
    weekday < 0 ||
    weekday > 6 ||
    !pattern.test(openTime) ||
    !pattern.test(closeTime) ||
    openTime >= closeTime
  )
    return res
      .status(400)
      .json({ message: "Use valid half-hour opening and closing times." });
  res.json(
    await WorkingHours.findOneAndUpdate(
      { weekday },
      { openTime, closeTime, isClosed: Boolean(isClosed) },
      { upsert: true, new: true, runValidators: true },
    ),
  );
});
app.use((req, res) =>
  res.status(404).json({ message: `No route for ${req.method} ${req.path}` }),
);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : "The server could not complete the request.",
  });
});
