import express from "express";
import authRoutes from "../routes/auth.routes.js";
import workoutRoutes from "../routes/workout.routes.js";
import mealRoutes from "../routes/meal.routes.js";
import statsRoutes from "../routes/stats.routes.js";
const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/meals", mealRoutes);
app.use("/stats", statsRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
