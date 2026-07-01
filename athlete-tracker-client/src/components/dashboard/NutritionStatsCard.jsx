import StatsCard from "./StatsCard";
import MacroSummary from "../nutrition/MacroSummary";

export default function NutritionStatsCard({ nutrition }) {
  if (!nutrition?.profileCompleted) {
    return (
      <StatsCard
        title="Calorías hoy"
        value="—"
        description="Completá tu perfil para ver tu meta diaria."
      />
    );
  }

  const { consumed, targetCalories, modeLabel, onTarget, remaining, macros } =
    nutrition;

  if (targetCalories == null) {
    return (
      <StatsCard
        title="Calorías hoy"
        value={consumed}
        unit="kcal"
        description={`Modo ${modeLabel}: sin meta numérica. Registrá lo que comés.`}
      />
    );
  }

  const progress = Math.min(100, Math.round((consumed / targetCalories) * 100));

  return (
    <article className="quest-card card-interactive p-5 pt-6 text-start">
      <h3 className="text-sm font-medium text-[var(--text)]">Calorías hoy</h3>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[var(--text-h)] sm:text-4xl">
        {consumed}
        <span className="ms-1 text-xl font-medium text-[var(--text)] sm:text-2xl">
          / {targetCalories} kcal
        </span>
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--code-bg)]"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso calórico del día"
      >
        <div
          className={`h-full rounded-full transition-all ${
            onTarget ? "bg-[var(--success)]" : "bg-[var(--accent)]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm leading-snug text-[var(--text)]">
        {onTarget
          ? `En objetivo (${modeLabel}).`
          : remaining > 0
            ? `Te faltan ${remaining} kcal (${modeLabel}).`
            : `Superaste la meta por ${Math.abs(remaining)} kcal.`}
      </p>
      <MacroSummary macros={macros} className="mt-4 border-t border-[var(--border)] pt-4" />
      {!macros?.configured ? (
        <p className="mt-3 text-xs text-[var(--text)]">
          Definí metas P/C/G en tu perfil y cargá macros en cada comida para ver
          el progreso.
        </p>
      ) : null}
    </article>
  );
}
