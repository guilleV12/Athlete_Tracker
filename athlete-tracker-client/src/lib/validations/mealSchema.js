import { z } from "zod";

export const MEAL_TYPES = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
  "Snack",
  "Otro",
];

export const mealSchema = z
  .object({
    mealType: z
      .string()
      .min(1, "Seleccioná el tipo de comida")
      .refine((val) => MEAL_TYPES.includes(val), {
        message: "Tipo de comida inválido",
      }),
    customMealType: z.string().optional(),
    calories: z.coerce
      .number({
        invalid_type_error: "Las calorías deben ser un número",
      })
      .int("Usá kcal enteras")
      .min(50, "Mínimo 50 kcal")
      .max(10000, "Máximo 10.000 kcal"),
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
  });

export function toMealPayload(data) {
  const type =
    data.mealType === "Otro"
      ? data.customMealType.trim()
      : data.mealType;

  return { type, calories: data.calories };
}

export const mealDefaultValues = {
  mealType: "",
  customMealType: "",
  calories: "",
};
