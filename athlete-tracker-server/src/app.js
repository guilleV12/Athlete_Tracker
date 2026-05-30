import "./config/env.js";
import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import insightRoutes from "./routes/insight.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "API Athlete Tracker", api: "/api/v1" });
  });

  app.use("/api/v1", apiRouter);
  app.use("/api/v1/insights", insightRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
