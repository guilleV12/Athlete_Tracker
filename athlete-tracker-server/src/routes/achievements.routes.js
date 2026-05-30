import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getCatalog } from "../controllers/achievements.controller.js";

const router = Router();

router.get("/", authMiddleware, getCatalog);

export default router;
