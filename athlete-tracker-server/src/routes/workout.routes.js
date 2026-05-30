import { Router } from "express";
import { create, getAll, getAchievements } from "../controllers/workout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);
router.get("/achievements", authMiddleware, getAchievements);

export default router;