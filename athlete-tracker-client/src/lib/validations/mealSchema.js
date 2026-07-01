import { z } from "zod";
import { caloriesFromMacros } from "../nutrition/macroUtils";

export const MEAL_TYPES = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
  "Snack",
  "Otro",
];

const macroGramSchema = z.coerce
  .number({ invalid_type_error: "Ingresá gramos válidos" })
  .int("Usá gramos enteros")
  .min(0, "Mínimo 0 g")
  .max(500, "Máximo 500 g");

export const mealSchema = z
  .object({
    mealType: z
      .string()
      .min(1, "Seleccioná el tipo de comida")
      .refine((val) => MEAL_TYPES.includes(val), {
        message: "Tipo de comida inválido",
      }),
    customMealType: z.string().optional(),
    proteinG: macroGramSchema,
    carbsG: macroGramSchema,
    fatG: macroGramSchema,
  })
  .superRefine((data, ctx) => {
    if (data.mealType !== "Otro") return;

    const custom = data.customMealType?.trim() ?? "";
    if (custom.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMealType"],
        message: "Describí la comida (mín. 2 caracteres)",
      });
    } else if (custom.length > 40) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customMealType"],
        message: "Máximo 40 caracteres",
      });
    }

    const kcal = caloriesFromMacros(data.proteinG, data.carbsG, data.fatG);
    if (kcal < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["proteinG"],
        message: "Los macros deben sumar al menos 50 kcal",
      });
    }
    if (kcal > 10000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["proteinG"],
        message: "Máximo 10.000 kcal por comida",
      });
    }
  });

export function toMealPayload(data) {
  const type =
    data.mealType === "Otro"
      ? data.customMealType.trim()
      : data.mealType;

  const proteinG = data.proteinG;
  const carbsG = data.carbsG;
  const fatG = data.fatG;
  const calories = caloriesFromMacros(proteinG, carbsG, fatG);

  return { type, proteinG, carbsG, fatG, calories };
}

export const mealDefaultValues = {
  mealType: "",
  customMealType: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
};
