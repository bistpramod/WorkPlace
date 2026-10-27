import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";
import { User, Service, WorkingHours } from "../models.js";
await mongoose.connect(config.mongoUri);
const services = [
  {
    name: "Signature Haircut",
    description: "Consultation, precision cut, and finish.",
    price: 1800,
  },
  {
    name: "Beard & Detail",
    description: "Shape, line-up, and conditioning treatment.",
    price: 950,
  },
  {
    name: "Refresh Facial",
    description: "A focused cleanse, exfoliation, and hydration.",
    price: 2200,
  },
];
for (const service of services)
  await Service.findOneAndUpdate({ name: service.name }, service, {
    upsert: true,
    new: true,
  });
for (let weekday = 0; weekday < 7; weekday++)
  await WorkingHours.findOneAndUpdate(
    { weekday },
    { openTime: "09:00", closeTime: "17:00", isClosed: weekday === 0 },
    { upsert: true },
  );
const email = process.env.ADMIN_EMAIL || "admin@slotwise.local",
  password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
await User.findOneAndUpdate(
  { email },
  {
    name: "SlotWise Admin",
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
  },
  { upsert: true },
);
console.log(`Seed complete. Admin: ${email}`);
await mongoose.disconnect();
