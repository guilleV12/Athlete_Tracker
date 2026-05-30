/** Ajustes fijos (kcal) sobre TDEE según modo nutricional. */
export const NUTRITION_ADJUSTMENTS = {
  maintenance: 0,
  deficit: -400,
  surplus: 300,
  intuitive: 0,
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateAgeFromBirthDate(birthDate) {
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function calculateBmr({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === "male") return Math.round(base + 5);
  return Math.round(base - 161);
}

export function calculateTdee(bmr, activityLevel) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  if (!multiplier) {
    throw new Error("Nivel de actividad inválido");
  }
  return Math.round(bmr * multiplier);
}

export function calculateTargetCalories({ tdee, nutritionMode }) {
  if (nutritionMode === "intuitive") {
    return { targetCalories: null, calorieAdjustment: 0 };
  }
  const calorieAdjustment = NUTRITION_ADJUSTMENTS[nutritionMode] ?? 0;
  const targetCalories = Math.max(1200, Math.round(tdee + calorieAdjustment));
  return { targetCalories, calorieAdjustment };
}

export function buildNutritionPlan(profileInput) {
  const age = calculateAgeFromBirthDate(profileInput.birthDate);
  const bmr = calculateBmr({
    sex: profileInput.sex,
    weightKg: profileInput.weightKg,
    heightCm: profileInput.heightCm,
    age,
  });
  const tdee = calculateTdee(bmr, profileInput.activityLevel);
  const { targetCalories, calorieAdjustment } = calculateTargetCalories({
    tdee,
    nutritionMode: profileInput.nutritionMode,
  });

  return {
    age,
    bmr,
    tdee,
    targetCalories,
    calorieAdjustment,
  };
}

/** ¿Consumo del día dentro del objetivo? (±10 %, mín. 120 kcal de margen) */
export function isCaloriesOnTarget(consumed, targetCalories) {
  if (targetCalories == null || targetCalories <= 0) return false;
  const tolerance = Math.max(120, Math.round(targetCalories * 0.1));
  return Math.abs(consumed - targetCalories) <= tolerance;
}

export const NUTRITION_MODE_LABELS = {
  maintenance: "Mantenimiento",
  deficit: "Déficit",
  surplus: "Superávit",
  intuitive: "Comer libre",
};

export const ACTIVITY_LEVEL_LABELS = {
  sedentary: "Sedentario",
  light: "Ligera (1–3 días/sem)",
  moderate: "Moderada (3–5 días/sem)",
  active: "Activa (6–7 días/sem)",
  very_active: "Muy activa / físico",
};
