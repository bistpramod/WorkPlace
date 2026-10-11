import { Router } from "express";
import { getDashboardSummary } from "../controllers/stats.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const statsRouter = Router();

statsRouter.get("/summary", asyncHandler(getDashboardSummary));
