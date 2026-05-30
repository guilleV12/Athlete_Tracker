import { prisma } from "../lib/prisma.js";
import { isCaloriesOnTarget } from "../lib/nutrition/calorieTargets.js";

async function unlockAchievement(userId, achievement) {
  const alreadyUnlocked = await prisma.userAchievement.findFirst({
    where: {
      userId,
      achievementId: achievement.id,
    },
  });
  if (alreadyUnlocked) return null;

  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });
  return {
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    condition: achievement.condition,
    category: achievement.category,
  };
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  const start = startOfDay(date);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

async function getCaloriesForDay(userId, day) {
  const meals = await prisma.meal.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay(day),
        lt: endOfDay(day),
      },
    },
  });
  return meals.reduce((sum, meal) => sum + meal.calories, 0);
}

async function countNutritionDaysOnTarget(userId, profile, minDays) {
  if (
    !profile?.profileCompleted ||
    profile.nutritionMode === "intuitive" ||
    profile.targetCalories == null
  ) {
    return 0;
  }

  let count = 0;
  const today = new Date();

  for (let offset = 0; offset < 60 && count < minDays; offset += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const consumed = await getCaloriesForDay(userId, day);
    if (consumed <= 0) continue;
    if (isCaloriesOnTarget(consumed, profile.targetCalories)) {
      count += 1;
    }
  }

  return count;
}

async function evaluateAchievement(userId, achievement, context) {
  const { workoutCount, mealCount, profile } = context;

  switch (achievement.condition) {
    case "workouts >= 1":
      return workoutCount >= 1
        ? unlockAchievement(userId, achievement)
        : null;
    case "workouts >= 7":
      return workoutCount >= 7
        ? unlockAchievement(userId, achievement)
        : null;
    case "workouts >= 30":
      return workoutCount >= 30
        ? unlockAchievement(userId, achievement)
        : null;
    case "meals >= 1":
      return mealCount >= 1 ? unlockAchievement(userId, achievement) : null;
    case "profile_completed":
      return profile?.profileCompleted
        ? unlockAchievement(userId, achievement)
        : null;
    case "nutrition_day_on_target": {
      if (
        !profile?.profileCompleted ||
        profile.nutritionMode === "intuitive" ||
        profile.targetCalories == null
      ) {
        return null;
      }
      const consumed = await getCaloriesForDay(userId, new Date());
      if (!isCaloriesOnTarget(consumed, profile.targetCalories)) {
        return null;
      }
      return unlockAchievement(userId, achievement);
    }
    case "nutrition_days_on_target >= 3": {
      const days = await countNutritionDaysOnTarget(userId, profile, 3);
      return days >= 3 ? unlockAchievement(userId, achievement) : null;
    }
    default:
      return null;
  }
}

export const checkAchievements = async (userId) => {
  const [workoutCount, mealCount, profile, achievements] = await Promise.all([
    prisma.workout.count({ where: { userId } }),
    prisma.meal.count({ where: { userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const context = { workoutCount, mealCount, profile };
  const newlyUnlocked = [];

  for (const achievement of achievements) {
    const unlocked = await evaluateAchievement(userId, achievement, context);
    if (unlocked) newlyUnlocked.push(unlocked);
  }

  return newlyUnlocked;
};

export const getAchievementsCatalog = async (userId) => {
  const [all, userRows] = await Promise.all([
    prisma.achievement.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
    }),
  ]);

  const unlockedMap = new Map(
    userRows.map((row) => [row.achievementId, row.unlockedAt]),
  );

  const catalog = all.map((achievement) => {
    const unlockedAt = unlockedMap.get(achievement.id);
    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      condition: achievement.condition,
      category: achievement.category,
      sortOrder: achievement.sortOrder,
      unlocked: Boolean(unlockedAt),
      unlockedAt: unlockedAt ? unlockedAt.toISOString() : null,
    };
  });

  const unlocked = catalog.filter((item) => item.unlocked).length;

  return {
    catalog,
    summary: {
      unlocked,
      total: catalog.length,
    },
  };
};

/** @deprecated Usar getAchievementsCatalog */
export const getUserAchievements = async (userId) => {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });
};
