import type { Request, Response } from "express";
import { CustomerModel } from "../models/Customer.js";

export async function getDashboardSummary(_req: Request, res: Response): Promise<void> {
  const [totalCustomers, activeCustomers] = await Promise.all([
    CustomerModel.countDocuments(),
    CustomerModel.countDocuments({ status: "active" }),
  ]);

  res.status(200).json({
    totalCustomers,
    activeCustomers,
    generatedAt: new Date().toISOString(),
  });
}
