import { Router } from "express";
import { getInsights } from "../controllers/insight.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getInsights);

export default router;