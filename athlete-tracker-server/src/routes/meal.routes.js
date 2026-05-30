import { Router } from "express";
import { create, getAll } from "../controllers/meal.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);

export default router;  