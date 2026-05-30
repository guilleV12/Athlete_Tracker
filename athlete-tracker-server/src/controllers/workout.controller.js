import { createWorkout, getUserWorkouts } from "../services/workout.service.js";
import {
    checkAchievements,
    getAchievementsCatalog,
} from "../services/achievement.service.js";

export const create = async (req, res) => {
    try {
        const workout = await createWorkout(req.body, req.user.userId);
        let newAchievements = [];
        try {
            newAchievements = await checkAchievements(req.user.userId);
        } catch {
            // No bloqueamos la creación del workout si falla achievements
        }
        res.status(201).json({ ...workout, newAchievements });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const workouts = await getUserWorkouts(req.user.userId);
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAchievements = async (req, res) => {
  try {
    const data = await getAchievementsCatalog(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};