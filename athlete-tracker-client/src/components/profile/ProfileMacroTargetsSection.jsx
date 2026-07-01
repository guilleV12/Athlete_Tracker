import FormField, { fieldInputClass } from "../ui/FormField";
import {
  estimatePlanFromForm,
  suggestMacroTargets,
} from "../../lib/nutrition/macroUtils";

export default function ProfileMacroTargetsSection({
  register,
  errors,
  watched,
  setValue,
  suggestedMacros,
}) {
  const applySuggestion = () => {
    const plan =
      suggestedMacros ??
      (() => {
        const estimate = estimatePlanFromForm(watched);
        if (!estimate?.targetCalories) return null;
        return suggestMacroTargets(estimate);
      })();

    if (!plan) return;

    setValue("targetProteinG", plan.proteinG, { shouldDirty: true });
    setValue("targetCarbsG", plan.carbsG, { shouldDirty: true });
    setValue("targetFatG", plan.fatG, { shouldDirty: true });
  };

  const canSuggest =
    watched.nutritionMode !== "intuitive" &&
    (suggestedMacros != null || estimatePlanFromForm(watched)?.targetCalories);

  return (
    <section className="quest-card space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-h)]">
          Metas de macros (g/día)
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          Definí tus objetivos diarios. Se comparan con lo que cargás en cada
          comida. La sugerencia es orientativa: revisala y guardá lo que uses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Proteína (g)"
          id="targetProteinG"
          error={errors.targetProteinG?.message}
        >
          <input
            id="targetProteinG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="Ej. 150"
            className={fieldInputClass(Boolean(errors.targetProteinG))}
            {...register("targetProteinG")}
          />
        </FormField>
        <FormField
          label="Carbos (g)"
          id="targetCarbsG"
          error={errors.targetCarbsG?.message}
        >
          <input
            id="targetCarbsG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="Ej. 200"
            className={fieldInputClass(Boolean(errors.targetCarbsG))}
            {...register("targetCarbsG")}
          />
        </FormField>
        <FormField
          label="Grasa (g)"
          id="targetFatG"
          error={errors.targetFatG?.message}
        >
          <input
            id="targetFatG"
            type="number"
            min={0}
            max={500}
            step={1}
            placeholder="Ej. 60"
            className={fieldInputClass(Boolean(errors.targetFatG))}
            {...register("targetFatG")}
          />
        </FormField>
      </div>

      {canSuggest ? (
        <button
          type="button"
          onClick={applySuggestion}
          className="btn-press rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-medium text-[var(--text-h)] hover:border-[var(--accent-border)]"
        >
          Usar sugerencia según meta calórica
        </button>
      ) : (
        <p className="text-xs text-[var(--text)]">
          En modo comer libre podés definir macros manualmente o dejarlos vacíos.
        </p>
      )}
    </section>
  );
}
