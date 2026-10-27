import mongoose from "mongoose";
const { Schema, model } = mongoose;
const User = model(
  "User",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      passwordHash: { type: String, required: true, select: false },
      role: { type: String, enum: ["customer", "admin"], default: "customer" },
    },
    { timestamps: true },
  ),
);
const Service = model(
  "Service",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      description: { type: String, default: "" },
      price: { type: Number, required: true, min: 0 },
      durationMinutes: { type: Number, enum: [30], default: 30 },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
  ),
);
const WorkingHours = model(
  "WorkingHours",
  new Schema(
    {
      weekday: { type: Number, required: true, unique: true, min: 0, max: 6 },
      openTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/,
      },
      closeTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/,
      },
      isClosed: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);
const Appointment = model(
  "Appointment",
  new Schema(
    {
      customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
      service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
      startAt: { type: Date, required: true },
      endAt: { type: Date, required: true },
      status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed",
      },
      blocksSlot: { type: Boolean, default: true },
    },
    { timestamps: true },
  ),
);
Appointment.schema.index(
  { startAt: 1 },
  { unique: true, partialFilterExpression: { blocksSlot: true } },
);
export { User, Service, WorkingHours, Appointment };
