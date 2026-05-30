import { prisma } from "../lib/prisma.js";

export const createMeal = async (data, userId) => {
    const { type, calories } = data;

    if (!type || !calories) {
        throw new Error("All fields are required");
    }

    if (calories < 0) {
        throw new Error("Calories cannot be negative");
    }

    const meal = await prisma.meal.create({
        data: {
            type,
            calories,
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