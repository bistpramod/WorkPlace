import { Router } from "express";
import { listCustomers } from "../controllers/customers.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const customersRouter = Router();
customersRouter.get("/", asyncHandler(listCustomers));
