import { DateTime } from "luxon";
import { config } from "./config/config.js";
import { Appointment, WorkingHours } from "./models.js";
export function parseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const day = DateTime.fromISO(value, { zone: config.timezone });
  return day.isValid && day.toISODate() === value ? day : null;
}
export async function isOpenSlot(date) {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime()) ||
    date <= new Date()
  )
    return false;
  const local = DateTime.fromJSDate(date, { zone: config.timezone });
  if (!local.isValid || local.minute % 30 || local.second || local.millisecond)
    return false;
  const hours = await WorkingHours.findOne({ weekday: local.weekday % 7 });
  if (!hours || hours.isClosed) return false;
  const start = local.toFormat("HH:mm"),
    end = local.plus({ minutes: 30 }).toFormat("HH:mm");
  return start >= hours.openTime && end <= hours.closeTime;
}
export async function availableSlots(value) {
  const day = parseDate(value);
  if (!day)
    throw Object.assign(new Error("Use a valid date in YYYY-MM-DD format."), {
      status: 400,
    });
  const hours = await WorkingHours.findOne({ weekday: day.weekday % 7 });
  if (!hours || hours.isClosed) return [];
  let cursor = DateTime.fromISO(`${value}T${hours.openTime}`, {
    zone: config.timezone,
  });
  const close = DateTime.fromISO(`${value}T${hours.closeTime}`, {
    zone: config.timezone,
  });
  const candidates = [];
  while (cursor.plus({ minutes: 30 }) <= close) {
    if (cursor.toJSDate() > new Date()) candidates.push(cursor.toUTC().toISO());
    cursor = cursor.plus({ minutes: 30 });
  }
  const booked = await Appointment.find({
    startAt: {
      $gte: day.startOf("day").toUTC().toJSDate(),
      $lt: day.plus({ days: 1 }).startOf("day").toUTC().toJSDate(),
    },
    blocksSlot: true,
  }).select("startAt");
  const taken = new Set(booked.map((a) => a.startAt.toISOString()));
  return candidates.filter((slot) => !taken.has(slot));
}
