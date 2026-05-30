import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";
import { notifyNewAchievements } from "../../lib/achievementNotifications";
import {
  MEAL_TYPES,
  mealDefaultValues,
  mealSchema,
  toMealPayload,
} from "../../lib/validations/mealSchema";
import FormField, { fieldInputClass } from "../ui/FormField";

export default function MealForm({ onSubmit }) {
  const toastApi = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mealSchema),
    defaultValues: mealDefaultValues,
    mode: "onTouched",
  });

  const mealType = watch("mealType");

  const onValidSubmit = async (data) => {
    setApiError("");
    try {
      const result = await onSubmit(toMealPayload(data));
      reset(mealDefaultValues);
      toastApi.success("Comida registrada correctamente.");
      notifyNewAchievements(toastApi, result?.newAchievements);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "No se pudo crear la comida."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
            className="quest-card p-4 sm:p-6"
      aria-busy={isSubmitting}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField
          label="Tipo de comida"
          id="mealType"
          error={errors.mealType?.message}
          required
        >
          <select
            id="mealType"
            className={fieldInputClass(Boolean(errors.mealType))}
            aria-invalid={Boolean(errors.mealType)}
            {...register("mealType")}
          >
            <option value="">Seleccioná una comida</option>
            {MEAL_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        {mealType === "Otro" ? (
          <FormField
            label="¿Cuál?"
            id="customMealType"
            error={errors.customMealType?.message}
            required
          >
            <input
              id="customMealType"
              type="text"
              placeholder="Ej. Batido proteico"
              className={fieldInputClass(Boolean(errors.customMealType))}
              aria-invalid={Boolean(errors.customMealType)}
              {...register("customMealType")}
            />
          </FormField>
        ) : null}

        <FormField
          label="Calorías"
          id="calories"
          error={errors.calories?.message}
          hint="Entre 50 y 10.000 kcal"
          required
        >
          <div className="relative">
            <input
              id="calories"
              type="number"
              inputMode="numeric"
              min={50}
              max={10000}
              step={10}
              placeholder="650"
              className={`${fieldInputClass(Boolean(errors.calories))} pe-14`}
              aria-invalid={Boolean(errors.calories)}
              {...register("calories")}
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text)]">
              kcal
            </span>
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-press btn-quest w-full min-h-11 self-center rounded-xl px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
        >
          {isSubmitting ? "Guardando…" : "Agregar comida"}
        </button>
      </div>

      {apiError ? (
        <p
          className="mt-4 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {apiError}
        </p>
      ) : null}
    </form>
  );
}
