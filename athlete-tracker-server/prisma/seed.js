import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { ACHIEVEMENT_DEFINITIONS } from "../src/lib/achievements/definitions.js";
import { buildNutritionPlan } from "../src/lib/nutrition/calorieTargets.js";

const prisma = new PrismaClient();

export const DEMO_USER = {
  email: "demo@athlete-tracker.dev",
  password: "Demo1234",
  name: "Martina Demo",
};

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  return d;
}

async function seedAchievements() {
  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const existing = await prisma.achievement.findFirst({
      where: { condition: achievement.condition },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: {
          name: achievement.name,
          description: achievement.description,
          sortOrder: achievement.sortOrder,
          category: achievement.category,
        },
      });
    } else {
      await prisma.achievement.create({ data: achievement });
    }
  }
}

async function unlockForUser(userId, conditions) {
  const achievements = await prisma.achievement.findMany({
    where: { condition: { in: conditions } },
  });

  for (const achievement of achievements) {
    const exists = await prisma.userAchievement.findFirst({
      where: { userId, achievementId: achievement.id },
    });
    if (!exists) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
    }
  }
}

async function seedDemoUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
  });

  if (existing) {
    console.log(`[seed] Usuario demo ya existe (${DEMO_USER.email}).`);
    return existing.id;
  }

  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
  const birthDate = new Date("1998-03-15");
  const profileInput = {
    birthDate,
    sex: "female",
    weightKg: 62,
    heightCm: 168,
    activityLevel: "moderate",
    nutritionMode: "maintenance",
  };
  const computed = buildNutritionPlan(profileInput);

  const user = await prisma.user.create({
    data: {
      email: DEMO_USER.email,
      password: hashedPassword,
      name: DEMO_USER.name,
      profile: {
        create: {
          birthDate,
          sex: profileInput.sex,
          weightKg: profileInput.weightKg,
          heightCm: profileInput.heightCm,
          activityLevel: profileInput.activityLevel,
          nutritionMode: profileInput.nutritionMode,
          bmr: computed.bmr,
          tdee: computed.tdee,
          targetCalories: computed.targetCalories,
          targetProteinG: 120,
          targetCarbsG: 200,
          targetFatG: 55,
          profileCompleted: true,
        },
      },
    },
  });

  await prisma.weightLog.create({
    data: {
      userId: user.id,
      weightKg: 62,
      recordedAt: daysAgo(14),
    },
  });
  await prisma.weightLog.create({
    data: {
      userId: user.id,
      weightKg: 61.5,
      recordedAt: daysAgo(7),
    },
  });
  await prisma.weightLog.create({
    data: {
      userId: user.id,
      weightKg: 62,
      recordedAt: daysAgo(0),
    },
  });

  const workouts = [
    { type: "Fuerza", duration: 55, intensity: 7, date: daysAgo(6) },
    { type: "Cardio", duration: 40, intensity: 6, date: daysAgo(5) },
    { type: "Fuerza", duration: 50, intensity: 8, date: daysAgo(3) },
    { type: "Movilidad", duration: 30, intensity: 4, date: daysAgo(2) },
    { type: "Fuerza", duration: 60, intensity: 7, date: daysAgo(1) },
    { type: "Cardio", duration: 35, intensity: 5, date: startOfToday() },
    { type: "Funcional", duration: 45, intensity: 6, date: daysAgo(4) },
  ];

  for (const workout of workouts) {
    await prisma.workout.create({
      data: { ...workout, userId: user.id },
    });
  }

  const todayMeals = [
    { type: "Desayuno", proteinG: 28, carbsG: 45, fatG: 10, offsetHours: 0 },
    { type: "Almuerzo", proteinG: 35, carbsG: 55, fatG: 14, offsetHours: 4 },
    { type: "Merienda", proteinG: 20, carbsG: 25, fatG: 8, offsetHours: 8 },
  ];

  for (const meal of todayMeals) {
    const date = startOfToday();
    date.setHours(date.getHours() + meal.offsetHours);
    const calories = meal.proteinG * 4 + meal.carbsG * 4 + meal.fatG * 9;
    await prisma.meal.create({
      data: {
        userId: user.id,
        type: meal.type,
        proteinG: meal.proteinG,
        carbsG: meal.carbsG,
        fatG: meal.fatG,
        calories,
        date,
      },
    });
  }

  await unlockForUser(user.id, [
    "workouts >= 1",
    "meals >= 1",
    "profile_completed",
    "workouts >= 7",
  ]);

  console.log(`[seed] Usuario demo creado: ${DEMO_USER.email}`);
  return user.id;
}

async function main() {
  await seedAchievements();
  await seedDemoUser();
  console.log("[seed] Listo.");
  console.log(`[seed] Demo → ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
