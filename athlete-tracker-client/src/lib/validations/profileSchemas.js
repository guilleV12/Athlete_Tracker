import { z } from "zod";

const macroGramSchema = z.coerce
  .number({ invalid_type_error: "Ingresá gramos válidos" })
  .int("Usá gramos enteros")
  .min(0, "Mínimo 0 g")
  .max(500, "Máximo 500 g");

export const macroFieldSchema = z
  .union([macroGramSchema, z.literal(""), z.null()])
  .optional();

export const profileSchema = z
  .object({
    birthDate: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Fecha inválida")
      .refine(
        (value) => new Date(value) < new Date(),
        "Debe ser una fecha pasada"
      ),
    sex: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Seleccioná sexo biológico para el cálculo" }),
    }),
    weightKg: z.coerce
      .number({ invalid_type_error: "Ingresá un peso válido" })
      .min(30, "Mínimo 30 kg")
      .max(300, "Máximo 300 kg"),
    heightCm: z.coerce
      .number({ invalid_type_error: "Ingresá una altura válida" })
      .min(100, "Mínimo 100 cm")
      .max(250, "Máximo 250 cm"),
    activityLevel: z.enum(
      ["sedentary", "light", "moderate", "active", "very_active"],
      { errorMap: () => ({ message: "Seleccioná nivel de actividad" }) }
    ),
    nutritionMode: z.enum(["maintenance", "deficit", "surplus", "intuitive"], {
      errorMap: () => ({ message: "Seleccioná un objetivo nutricional" }),
    }),
    targetProteinG: macroFieldSchema,
    targetCarbsG: macroFieldSchema,
    targetFatG: macroFieldSchema,
  })
  .superRefine((data, ctx) => {
    const fields = [data.targetProteinG, data.targetCarbsG, data.targetFatG];
    const filled = fields.filter(
      (v) => v !== undefined && v !== null && v !== ""
    );
    if (filled.length === 0 || filled.length === 3) return;

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["targetProteinG"],
      message: "Completá las tres metas de macros o dejalas vacías",
    });
  });
