import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildNutritionPlan,
  calculateBmr,
  isCaloriesOnTarget,
} from "./calorieTargets.js";

describe("calorieTargets", () => {
  it("calcula BMR femenino (Mifflin-St Jeor)", () => {
    const bmr = calculateBmr({
      sex: "female",
      weightKg: 62,
      heightCm: 168,
      age: 28,
    });
    assert.equal(bmr, 1369);
  });

  it("arma plan de mantenimiento con TDEE y meta", () => {
    const plan = buildNutritionPlan({
      birthDate: new Date("1998-03-15"),
      sex: "female",
      weightKg: 62,
      heightCm: 168,
      activityLevel: "moderate",
      nutritionMode: "maintenance",
    });

    assert.ok(plan.bmr > 0);
    assert.ok(plan.tdee >= plan.bmr);
    assert.equal(plan.targetCalories, plan.tdee);
    assert.equal(plan.calorieAdjustment, 0);
  });

  it("aplica déficit fijo de 400 kcal", () => {
    const plan = buildNutritionPlan({
      birthDate: new Date("1998-03-15"),
      sex: "female",
      weightKg: 62,
      heightCm: 168,
      activityLevel: "moderate",
      nutritionMode: "deficit",
    });

    assert.equal(plan.targetCalories, plan.tdee - 400);
  });

  it("detecta día en objetivo dentro de ±10%", () => {
    assert.equal(isCaloriesOnTarget(2000, 2000), true);
    assert.equal(isCaloriesOnTarget(1900, 2000), true);
    assert.equal(isCaloriesOnTarget(1600, 2000), false);
  });
});
