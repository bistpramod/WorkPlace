import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { healthRouter } from "./routes/health.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { customersRouter } from "./routes/customers.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
  }),
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/stats", statsRouter);
app.use("/api/customers", customersRouter);

app.use(notFound);
app.use(errorHandler);
