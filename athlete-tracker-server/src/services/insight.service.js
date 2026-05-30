import { prisma } from "../lib/prisma.js";
import { isCaloriesOnTarget } from "../lib/nutrition/calorieTargets.js";

export const generateInsights = async (userId) => {
    const workouts = await prisma.workout.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7,
    });

    const meals = await prisma.meal.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7
    });

    const insights = [];

    const totalWorkouts = workouts.length;

    const avgIntensity = totalWorkouts > 0 ? workouts.reduce((sum, w) => sum + w.intensity, 0) / totalWorkouts : 0;

    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const avgCalories = meals.length > 0 ? totalCalories / meals.length : 0;

    if (totalWorkouts >= 5 && avgCalories < 2000) {
        insights.push({
            type: "warning",
            message: "Estás entrenando mucho pero consumiendo pocas calorías.",
        })
    }

    if (avgIntensity >= 8) {
        insights.push({
          type: "performance",
          message:
            "Tu intensidad promedio es muy alta. Asegurate de descansar bien.",
        });
    }

    if (totalWorkouts === 0) {
        insights.push({
          type: "motivation",
          message:
            "Todavía no registraste entrenamientos esta semana.",
        });
    }

    if (totalWorkouts >= 7) {
        insights.push({
          type: "success",
          message:
            "Excelente consistencia esta semana 🔥",
        });
    }

    const profile = await prisma.userProfile.findUnique({
        where: { userId },
    });

    if (!profile?.profileCompleted) {
        insights.push({
            type: "motivation",
            message:
                "Completá tu perfil para calcular tus calorías diarias según tu objetivo.",
        });
    } else if (profile.nutritionMode === "intuitive") {
        insights.push({
            type: "motivation",
            message:
                "Modo comer libre: registrá comidas sin presión de meta numérica.",
        });
    } else if (profile.targetCalories != null) {
        const today = new Date();
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );
        const todayMeals = await prisma.meal.findMany({
            where: { userId, date: { gte: startOfDay } },
        });
        const consumedToday = todayMeals.reduce((s, m) => s + m.calories, 0);
        const remaining = profile.targetCalories - consumedToday;

        if (isCaloriesOnTarget(consumedToday, profile.targetCalories)) {
            insights.push({
                type: "success",
                message: "¡Hoy estás en tu rango calórico objetivo!",
            });
        } else if (remaining > 400) {
            insights.push({
                type: "warning",
                message: `Te faltan unas ${remaining} kcal para llegar a tu meta de hoy.`,
            });
        } else if (remaining < -300) {
            insights.push({
                type: "warning",
                message:
                    "Superaste tu meta calórica de hoy. Revisá porciones si buscás déficit.",
            });
        }
    }

    return insights;
};