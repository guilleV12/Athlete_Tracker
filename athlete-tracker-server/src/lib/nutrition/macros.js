/** kcal desde gramos: 4·P + 4·C + 9·G */
export function caloriesFromMacros({ proteinG, carbsG, fatG }) {
  return Math.round(proteinG * 4 + carbsG * 4 + fatG * 9);
}

export function hasMacroTargets(profile) {
  return (
    profile?.targetProteinG != null &&
    profile?.targetCarbsG != null &&
    profile?.targetFatG != null
  );
}

export function mapMacroTargets(profile) {
  if (!hasMacroTargets(profile)) return null;
  return {
    proteinG: profile.targetProteinG,
    carbsG: profile.targetCarbsG,
    fatG: profile.targetFatG,
  };
}

export function validateMacroTargetsInput(data) {
  const raw = [data.targetProteinG, data.targetCarbsG, data.targetFatG];
  const allEmpty = raw.every(
    (v) => v === undefined || v === null || v === "",
  );
  if (allEmpty) return null;

  const parsed = raw.map((v) => {
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 500) {
      throw new Error("Metas de macros inválidas (0–500 g cada una)");
    }
    return n;
  });

  return {
    targetProteinG: parsed[0],
    targetCarbsG: parsed[1],
    targetFatG: parsed[2],
  };
}

export function validateMealMacros({ proteinG, carbsG, fatG }) {
  const values = [proteinG, carbsG, fatG].map((v) => Number(v));
  if (values.some((n) => !Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 500)) {
    throw new Error("Macros inválidos (0–500 g por nutriente)");
  }

  const macros = {
    proteinG: values[0],
    carbsG: values[1],
    fatG: values[2],
  };

  const calories = caloriesFromMacros(macros);
  if (calories < 50) {
    throw new Error("La comida debe aportar al menos 50 kcal según los macros");
  }
  if (calories > 10000) {
    throw new Error("Máximo 10.000 kcal por comida");
  }

  return { ...macros, calories };
}

export function sumMealMacros(meals) {
  return meals.reduce(
    (acc, meal) => ({
      proteinG: acc.proteinG + (meal.proteinG ?? 0),
      carbsG: acc.carbsG + (meal.carbsG ?? 0),
      fatG: acc.fatG + (meal.fatG ?? 0),
    }),
    { proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

export function buildMacroProgress(consumed, targets) {
  if (!targets) return null;

  const pct = (consumedVal, targetVal) =>
    targetVal > 0 ? Math.round((consumedVal / targetVal) * 100) : 0;

  return {
    configured: true,
    targets,
    consumed,
    proteinPct: pct(consumed.proteinG, targets.proteinG),
    carbsPct: pct(consumed.carbsG, targets.carbsG),
    fatPct: pct(consumed.fatG, targets.fatG),
  };
}
