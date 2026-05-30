import { Router } from "express";
import { getDashboard } from "../controllers/stats.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, getDashboard);

export default router;