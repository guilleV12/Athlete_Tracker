import { prisma } from "../lib/prisma.js";
import {
  buildNutritionPlan,
  calculateAgeFromBirthDate,
  calculateMacros,
  NUTRITION_MODE_LABELS,
  ACTIVITY_LEVEL_LABELS,
} from "../lib/nutrition/calorieTargets.js";
import {
  mapMacroTargets,
  validateMacroTargetsInput,
} from "../lib/nutrition/macros.js";
import { checkAchievements } from "./achievement.service.js";

const VALID_SEX = new Set(["male", "female"]);
const VALID_ACTIVITY = new Set([
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
]);
const VALID_MODES = new Set(["maintenance", "deficit", "surplus", "intuitive"]);

function validateProfileInput(data) {
  const birthDate = data.birthDate ? new Date(data.birthDate) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime())) {
    throw new Error("Fecha de nacimiento inválida");
  }
  const today = new Date();
  if (birthDate >= today) {
    throw new Error("La fecha de nacimiento debe ser anterior a hoy");
  }

  const ageYears = calculateAgeFromBirthDate(birthDate);
  if (ageYears < 13 || ageYears > 100) {
    throw new Error("La edad debe estar entre 13 y 100 años");
  }

  const sex = data.sex;
  if (!VALID_SEX.has(sex)) {
    throw new Error("Sexo inválido (male o female)");
  }

  const weightKg = Number(data.weightKg);
  const heightCm = Number(data.heightCm);
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    throw new Error("Peso inválido (30–300 kg)");
  }
  if (!Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) {
    throw new Error("Altura inválida (100–250 cm)");
  }

  const activityLevel = data.activityLevel;
  if (!VALID_ACTIVITY.has(activityLevel)) {
    throw new Error("Nivel de actividad inválido");
  }

  const nutritionMode = data.nutritionMode;
  if (!VALID_MODES.has(nutritionMode)) {
    throw new Error("Modo nutricional inválido");
  }

  const macroTargets = validateMacroTargetsInput(data);

  return {
    birthDate,
    sex,
    weightKg,
    heightCm,
    activityLevel,
    nutritionMode,
    macroTargets,
  };
}

const WEIGHT_HISTORY_LIMIT = 30;

function validateWeightKg(weightKg) {
  const value = Number(weightKg);
  if (!Number.isFinite(value) || value < 30 || value > 300) {
    throw new Error("Peso inválido (30–300 kg)");
  }
  return value;
}

async function getWeightHistory(userId) {
  const logs = await prisma.weightLog.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: WEIGHT_HISTORY_LIMIT,
    select: {
      id: true,
      weightKg: true,
      recordedAt: true,
    },
  });

  return logs
    .map((log) => ({
      id: log.id,
      weightKg: log.weightKg,
      recordedAt: log.recordedAt.toISOString(),
    }))
    .reverse();
}

async function createWeightLogIfChanged(userId, weightKg, previousWeightKg) {
  if (previousWeightKg != null && previousWeightKg === weightKg) {
    return;
  }
  await prisma.weightLog.create({
    data: { userId, weightKg },
  });
}

function mapProfileResponse(profile, computed) {
  const macroTargets = mapMacroTargets(profile);
  const suggestedMacros =
    profile.targetCalories != null && profile.nutritionMode !== "intuitive"
      ? calculateMacros({
          targetCalories: profile.targetCalories,
          weightKg: profile.weightKg,
          nutritionMode: profile.nutritionMode,
        })
      : null;

  return {
    profile: {
      birthDate: profile.birthDate.toISOString(),
      sex: profile.sex,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      activityLevel: profile.activityLevel,
      activityLevelLabel: ACTIVITY_LEVEL_LABELS[profile.activityLevel],
      nutritionMode: profile.nutritionMode,
      nutritionModeLabel: NUTRITION_MODE_LABELS[profile.nutritionMode],
      profileCompleted: profile.profileCompleted,
      updatedAt: profile.updatedAt.toISOString(),
      macroTargets,
    },
    computed: {
      age: computed.age,
      bmr: profile.bmr,
      tdee: profile.tdee,
      targetCalories: profile.targetCalories,
      calorieAdjustment: computed.calorieAdjustment,
      suggestedMacros,
    },
  };
}

export async function getUserProfile(userId) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return {
      profile: null,
      computed: null,
      weightHistory: [],
      profileCompleted: false,
    };
  }

  const weightHistory = await getWeightHistory(userId);

  const computed = buildNutritionPlan({
    birthDate: profile.birthDate,
    sex: profile.sex,
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    activityLevel: profile.activityLevel,
    nutritionMode: profile.nutritionMode,
  });

  return {
    ...mapProfileResponse(profile, computed),
    weightHistory,
    profileCompleted: profile.profileCompleted,
  };
}

export async function upsertUserProfile(userId, data) {
  const input = validateProfileInput(data);
  const computed = buildNutritionPlan(input);

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: { weightKg: true },
  });

  const macroData = input.macroTargets
    ? {
        targetProteinG: input.macroTargets.targetProteinG,
        targetCarbsG: input.macroTargets.targetCarbsG,
        targetFatG: input.macroTargets.targetFatG,
      }
    : {
        targetProteinG: null,
        targetCarbsG: null,
        targetFatG: null,
      };

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      birthDate: input.birthDate,
      sex: input.sex,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      activityLevel: input.activityLevel,
      nutritionMode: input.nutritionMode,
      bmr: computed.bmr,
      tdee: computed.tdee,
      targetCalories: computed.targetCalories,
      ...macroData,
      profileCompleted: true,
    },
    update: {
      birthDate: input.birthDate,
      sex: input.sex,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      activityLevel: input.activityLevel,
      nutritionMode: input.nutritionMode,
      bmr: computed.bmr,
      tdee: computed.tdee,
      targetCalories: computed.targetCalories,
      ...macroData,
      profileCompleted: true,
    },
  });

  await createWeightLogIfChanged(
    userId,
    input.weightKg,
    existing?.weightKg ?? null
  );

  let newAchievements = [];
  try {
    newAchievements = await checkAchievements(userId);
  } catch {
    // no bloquear guardado de perfil
  }

  const weightHistory = await getWeightHistory(userId);

  return {
    ...mapProfileResponse(profile, computed),
    weightHistory,
    profileCompleted: true,
    newAchievements,
  };
}

export async function logUserWeight(userId, weightKgRaw) {
  const weightKg = validateWeightKg(weightKgRaw);

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Completá tu perfil antes de registrar el peso.");
  }

  const computed = buildNutritionPlan({
    birthDate: profile.birthDate,
    sex: profile.sex,
    weightKg,
    heightCm: profile.heightCm,
    activityLevel: profile.activityLevel,
    nutritionMode: profile.nutritionMode,
  });

  const updated = await prisma.userProfile.update({
    where: { userId },
    data: {
      weightKg,
      bmr: computed.bmr,
      tdee: computed.tdee,
      targetCalories: computed.targetCalories,
    },
  });

  await createWeightLogIfChanged(userId, weightKg, profile.weightKg);

  const weightHistory = await getWeightHistory(userId);

  return {
    ...mapProfileResponse(updated, computed),
    weightHistory,
    profileCompleted: updated.profileCompleted,
  };
}

export async function isProfileCompleted(userId) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { profileCompleted: true },
  });
  return Boolean(profile?.profileCompleted);
}
