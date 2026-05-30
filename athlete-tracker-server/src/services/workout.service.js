import { prisma } from "../lib/prisma.js";

export const createWorkout = async (data, userId) => {
    if (!data || typeof data !== "object") {
        throw new Error("Request body is required");
    }

    const { type, duration, intensity } = data;

    if (!type || !duration || !intensity) {
        throw new Error("All fields are required");
    }

    const workout = await prisma.workout.create({
        data: {
            type,
            duration,
            intensity,
            userId,
        },
    });

    return workout;
};

export const getUserWorkouts = async (userId) => {
    return await prisma.workout.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
};