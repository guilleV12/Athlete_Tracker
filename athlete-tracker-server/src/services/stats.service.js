import { prisma } from "../lib/prisma.js";
import { isCaloriesOnTarget, NUTRITION_MODE_LABELS } from "../lib/nutrition/calorieTargets.js";

export const getDashboardStats = async (userId) => {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    )

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - 7);

    const todayMeals = await prisma.meal.findMany({
        where: {
            userId,
            date: {
                gte: startOfDay,
            },
        },
    });

    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);

    const todayWorkouts = await prisma.workout.findMany({
        where: {
            userId,
            date: {
                gte: startOfDay,
            },
        }
    });

    const workoutCount = todayWorkouts.length;

    const avgIntensity = 
        workoutCount > 0 
        ? todayWorkouts.reduce((sum, w) => sum + w.intensity, 0)
        / workoutCount
        : 0;

    const weekWorkouts = await prisma.workout.findMany({
        where: {
            userId,
            date: {
                gte: startOfWeek,
            },
        }
    });

    const byDay = [];
    for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(startOfDay);
        dayStart.setDate(startOfDay.getDate() - i);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const count = weekWorkouts.filter(
            (w) => w.date >= dayStart && w.date < dayEnd
        ).length;

        byDay.push({
            date: dayStart.toISOString(),
            workouts: count,
        });
    }

    const profile = await prisma.userProfile.findUnique({
        where: { userId },
    });

    let nutrition = {
        profileCompleted: false,
        mode: null,
        modeLabel: null,
        targetCalories: null,
        consumed: totalCalories,
        remaining: null,
        onTarget: false,
    };

    if (profile?.profileCompleted) {
        nutrition = {
            profileCompleted: true,
            mode: profile.nutritionMode,
            modeLabel: NUTRITION_MODE_LABELS[profile.nutritionMode] ?? profile.nutritionMode,
            targetCalories: profile.targetCalories,
            consumed: totalCalories,
            remaining:
                profile.targetCalories != null
                    ? profile.targetCalories - totalCalories
                    : null,
            onTarget: isCaloriesOnTarget(totalCalories, profile.targetCalories),
        };
    }

    return {
        today: {
            totalCalories,
            workoutCount,
            avgIntensity,
        },
        week: {
            workouts: weekWorkouts.length,
            byDay,
        },
        nutrition,
    };
};