import { prisma } from "../lib/prisma.js";
import { validateMealMacros } from "../lib/nutrition/macros.js";

export const createMeal = async (data, userId) => {
    const { type } = data;

    if (!type?.trim()) {
        throw new Error("All fields are required");
    }

    const { proteinG, carbsG, fatG, calories } = validateMealMacros(data);

    const meal = await prisma.meal.create({
        data: {
            type: type.trim(),
            calories,
            proteinG,
            carbsG,
            fatG,
            userId,
        },
    });

    return meal;
};

export const getUserMeals = async (userId) => {
    return await prisma.meal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
};
