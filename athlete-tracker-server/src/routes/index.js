import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { userRouter } from "./user.routes.js";
import authRouter from "./auth.routes.js";
import workoutRouter from "./workout.routes.js";
import mealRouter from "./meal.routes.js";
import statsRouter from "./stats.routes.js";
import profileRouter from "./profile.routes.js";
import achievementsRouter from "./achievements.routes.js";

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/workouts", workoutRouter);
apiRouter.use("/meals", mealRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/achievements", achievementsRouter);

export { apiRouter };
