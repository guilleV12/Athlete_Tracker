import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { listUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(listUsers));
router.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.user.userId });
});

export { router as userRouter };
