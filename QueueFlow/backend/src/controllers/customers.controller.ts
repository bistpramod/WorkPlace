import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import { CustomerModel, type Customer } from "../models/Customer.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function positiveInteger(value: unknown, fallback: number): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listCustomers(req: Request, res: Response): Promise<void> {
  const page = positiveInteger(req.query.page, DEFAULT_PAGE);
  const limit = Math.min(positiveInteger(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const filter: FilterQuery<Customer> = search
    ? { $or: ["name", "email", "company"].map((field) => ({ [field]: { $regex: escapeRegExp(search), $options: "i" } })) }
    : {};

  const [customers, total] = await Promise.all([
    CustomerModel.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).select("name email company status createdAt").lean(),
    CustomerModel.countDocuments(filter),
  ]);

  res.status(200).json({ data: customers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
