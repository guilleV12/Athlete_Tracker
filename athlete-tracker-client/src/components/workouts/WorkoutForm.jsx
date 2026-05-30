import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";
import { notifyNewAchievements } from "../../lib/achievementNotifications";
import {
  WORKOUT_ACTIVITIES,
  toWorkoutPayload,
  workoutDefaultValues,
  workoutSchema,
} from "../../lib/validations/workoutSchema";
import FormField, { fieldInputClass } from "../ui/FormField";

const INTENSITY_LABELS = {
  1: "Muy suave",
  2: "Suave",
  3: "Ligero",
  4: "Moderado",
  5: "Medio",
  6: "Exigente",
  7: "Duro",
  8: "Muy duro",
  9: "Casi máximo",
  10: "Máximo",
};

export default function WorkoutForm({ onSubmit }) {
  const toastApi = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workoutSchema),
    defaultValues: workoutDefaultValues,
    mode: "onTouched",
  });

  const activity = watch("activity");
  const intensity = watch("intensity");

  const onValidSubmit = async (data) => {
    setApiError("");
    try {
      const result = await onSubmit(toWorkoutPayload(data));
      reset(workoutDefaultValues);
      toastApi.success("Entrenamiento registrado correctamente.");
      notifyNewAchievements(toastApi, result?.newAchievements);
    } catch (err) {
      setApiError(
        getApiErrorMessage(err, "No se pudo crear el entrenamiento.")
      );
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
          label="Tipo de entrenamiento"
          id="activity"
          error={errors.activity?.message}
          required
        >
          <select
            id="activity"
            className={fieldInputClass(Boolean(errors.activity))}
            aria-invalid={Boolean(errors.activity)}
            aria-describedby={errors.activity ? "activity-error" : undefined}
            {...register("activity")}
          >
            <option value="">Seleccioná una actividad</option>
            {WORKOUT_ACTIVITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>

        {activity === "Otro" ? (
          <FormField
            label="¿Cuál?"
            id="customActivity"
            error={errors.customActivity?.message}
            required
            className="sm:col-span-2 lg:col-span-1"
          >
            <input
              id="customActivity"
              type="text"
              placeholder="Ej. Padel, CrossFit..."
              className={fieldInputClass(Boolean(errors.customActivity))}
              aria-invalid={Boolean(errors.customActivity)}
              {...register("customActivity")}
            />
          </FormField>
        ) : null}

        <FormField
          label="Duración"
          id="duration"
          error={errors.duration?.message}
          hint="Entre 5 y 600 minutos"
          required
        >
          <div className="relative">
            <input
              id="duration"
              type="number"
              inputMode="numeric"
              min={5}
              max={600}
              step={5}
              placeholder="45"
              className={`${fieldInputClass(Boolean(errors.duration))} pe-12`}
              aria-invalid={Boolean(errors.duration)}
              {...register("duration")}
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text)]">
              min
            </span>
          </div>
        </FormField>

        <FormField
          label="Intensidad"
          id="intensity"
          error={errors.intensity?.message}
          hint={INTENSITY_LABELS[intensity] ?? "Del 1 (suave) al 10 (máximo)"}
          required
          className="sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-3 pt-1">
            <input
              id="intensity"
              type="range"
              min={1}
              max={10}
              step={1}
              className="h-2 w-full flex-1 cursor-pointer accent-[var(--accent)]"
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={Number(intensity) || 5}
              aria-invalid={Boolean(errors.intensity)}
              {...register("intensity", { valueAsNumber: true })}
            />
            <span className="w-8 shrink-0 text-end text-lg font-semibold tabular-nums text-[var(--text-h)]">
              {intensity || "—"}
            </span>
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-press btn-quest w-full min-h-11 self-center rounded-xl px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
        >
          {isSubmitting ? "Guardando…" : "Agregar workout"}
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
