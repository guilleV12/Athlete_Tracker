import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getHealth, getRoot } from "../controllers/healthController.js";

const router = Router();

router.get("/", getRoot);
router.get("/health", asyncHandler(getHealth));

export { router as healthRouter };
