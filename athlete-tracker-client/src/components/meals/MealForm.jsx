import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";
import { notifyNewAchievements } from "../../lib/achievementNotifications";
import { caloriesFromMacros } from "../../lib/nutrition/macroUtils";
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
  const proteinG = watch("proteinG");
  const carbsG = watch("carbsG");
  const fatG = watch("fatG");
  const estimatedKcal = caloriesFromMacros(proteinG, carbsG, fatG);

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          label="Proteína (g)"
          id="proteinG"
          error={errors.proteinG?.message}
          required
        >
          <input
            id="proteinG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="30"
            className={fieldInputClass(Boolean(errors.proteinG))}
            {...register("proteinG")}
          />
        </FormField>

        <FormField
          label="Carbos (g)"
          id="carbsG"
          error={errors.carbsG?.message}
          required
        >
          <input
            id="carbsG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="45"
            className={fieldInputClass(Boolean(errors.carbsG))}
            {...register("carbsG")}
          />
        </FormField>

        <FormField
          label="Grasa (g)"
          id="fatG"
          error={errors.fatG?.message}
          required
        >
          <input
            id="fatG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="12"
            className={fieldInputClass(Boolean(errors.fatG))}
            {...register("fatG")}
          />
        </FormField>

        <div className="flex flex-col justify-end gap-1 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-[var(--text)]">Calorías estimadas</p>
          <p className="text-2xl font-semibold tabular-nums text-[var(--text-h)]">
            {estimatedKcal > 0 ? `${estimatedKcal} kcal` : "—"}
          </p>
          <p className="text-xs text-[var(--text)]">4·P + 4·C + 9·G</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-press btn-quest min-h-11 w-full self-end rounded-xl px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-3"
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
