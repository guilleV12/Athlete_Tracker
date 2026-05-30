import { createMeal, getUserMeals } from "../services/meal.service.js";
import { checkAchievements } from "../services/achievement.service.js";

export const create = async (req, res) => {
    try {
        const meal = await createMeal(req.body, req.user.userId);
        let newAchievements = [];
        try {
            newAchievements = await checkAchievements(req.user.userId);
        } catch {
            // no bloquear creación de comida
        }
        res.status(201).json({ ...meal, newAchievements });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const meals = await getUserMeals(req.user.userId);
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};