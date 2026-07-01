import "./config/env.js";
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import insightRoutes from "./routes/insight.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin:
        env.nodeEnv === "production"
          ? [env.frontendUrl]
          : [env.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    })
  );
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
