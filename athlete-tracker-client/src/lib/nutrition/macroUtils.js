/** kcal desde gramos: 4·P + 4·C + 9·G */
export function caloriesFromMacros(proteinG, carbsG, fatG) {
  const p = Number(proteinG) || 0;
  const c = Number(carbsG) || 0;
  const f = Number(fatG) || 0;
  return Math.round(p * 4 + c * 4 + f * 9);
}

const PROTEIN_G_PER_KG = {
  deficit: 2.0,
  maintenance: 1.6,
  surplus: 1.8,
};

/** Sugerencia orientativa — el usuario debe confirmar y guardar. */
export function suggestMacroTargets({ targetCalories, weightKg, nutritionMode }) {
  if (targetCalories == null || nutritionMode === "intuitive") {
    return null;
  }

  const proteinPerKg = PROTEIN_G_PER_KG[nutritionMode] ?? 1.6;
  const proteinG = Math.round(Number(weightKg) * proteinPerKg);
  const proteinKcal = proteinG * 4;
  const fatKcal = Math.round(targetCalories * 0.25);
  const fatG = Math.round(fatKcal / 9);
  const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
  const carbsG = Math.round(carbKcal / 4);

  return { proteinG, fatG, carbsG };
}

export function estimatePlanFromForm(values) {
  const weightKg = Number(values.weightKg);
  if (!Number.isFinite(weightKg)) return null;

  const birth = new Date(values.birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  const base = 10 * weightKg + 6.25 * Number(values.heightCm) - 5 * age;
  const bmr =
    values.sex === "male" ? Math.round(base + 5) : Math.round(base - 161);

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = Math.round(bmr * (multipliers[values.activityLevel] ?? 1.55));

  const adjustments = {
    maintenance: 0,
    deficit: -400,
    surplus: 300,
    intuitive: 0,
  };

  if (values.nutritionMode === "intuitive") {
    return { targetCalories: null };
  }

  const targetCalories = Math.max(
    1200,
    Math.round(tdee + (adjustments[values.nutritionMode] ?? 0))
  );

  return { targetCalories, weightKg, nutritionMode: values.nutritionMode };
}
