import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  logWeight,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.post("/weight", authMiddleware, logWeight);

export default router;
