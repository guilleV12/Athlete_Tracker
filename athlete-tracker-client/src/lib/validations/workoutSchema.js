import { z } from "zod";

export const WORKOUT_ACTIVITIES = [
  "Running",
  "Ciclismo",
  "Natación",
  "Fuerza",
  "Yoga",
  "HIIT",
  "Caminata",
  "Otro",
];

export const workoutSchema = z
  .object({
    activity: z
      .string()
      .min(1, "Seleccioná un tipo de entrenamiento")
      .refine((val) => WORKOUT_ACTIVITIES.includes(val), {
        message: "Tipo de entrenamiento inválido",
      }),
    customActivity: z.string().optional(),
    duration: z.coerce
      .number({
        invalid_type_error: "La duración debe ser un número",
      })
      .int("Usá minutos enteros")
      .min(5, "Mínimo 5 minutos")
      .max(600, "Máximo 600 minutos (10 h)"),
    intensity: z.coerce
      .number({
        invalid_type_error: "La intensidad debe ser un número",
      })
      .int("Usá un valor entero del 1 al 10")
      .min(1, "Mínimo 1")
      .max(10, "Máximo 10"),
  })
  .superRefine((data, ctx) => {
    if (data.activity !== "Otro") return;

    const custom = data.customActivity?.trim() ?? "";
    if (custom.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customActivity"],
        message: "Describí el entrenamiento (mín. 2 caracteres)",
      });
    } else if (custom.length > 40) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customActivity"],
        message: "Máximo 40 caracteres",
      });
    }
  });

export function toWorkoutPayload(data) {
  const type =
    data.activity === "Otro"
      ? data.customActivity.trim()
      : data.activity;

  return {
    type,
    duration: data.duration,
    intensity: data.intensity,
  };
}

export const workoutDefaultValues = {
  activity: "",
  customActivity: "",
  duration: "",
  intensity: 5,
};
