function MacroBar({ label, consumed, target, pct, colorClass }) {
  const hasTarget = target != null && target > 0;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-[var(--text-h)]">{label}</span>
        <span className="tabular-nums text-[var(--text)]">
          {consumed ?? 0} g
          {hasTarget ? ` / ${target} g` : ""}
          {hasTarget && pct != null ? ` · ${pct}%` : ""}
        </span>
      </div>
      {hasTarget ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--code-bg)]">
          <div
            className={`h-full rounded-full ${colorClass}`}
            style={{ width: `${Math.min(100, pct ?? 0)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Metas guardadas en perfil (solo objetivos). */
export function MacroTargetsSummary({ targets, className = "" }) {
  if (!targets) return null;

  return (
    <ul className={`space-y-1 text-sm text-[var(--text-h)] ${className}`}>
      <li>
        <span className="text-[var(--text)]">Proteína:</span> {targets.proteinG}{" "}
        g/día
      </li>
      <li>
        <span className="text-[var(--text)]">Carbos:</span> {targets.carbsG} g/día
      </li>
      <li>
        <span className="text-[var(--text)]">Grasa:</span> {targets.fatG} g/día
      </li>
    </ul>
  );
}

/** Progreso del día: consumido vs meta del perfil. */
export default function MacroSummary({ macros, className = "" }) {
  if (!macros?.configured) return null;

  const { consumed, targets, proteinPct, carbsPct, fatPct } = macros;

  return (
    <div className={`space-y-2.5 ${className}`}>
      <p className="text-xs font-medium text-[var(--text)]">
        Macros hoy (consumido / meta)
      </p>
      <MacroBar
        label="Proteína"
        consumed={consumed.proteinG}
        target={targets.proteinG}
        pct={proteinPct}
        colorClass="bg-[var(--accent)]"
      />
      <MacroBar
        label="Grasa"
        consumed={consumed.fatG}
        target={targets.fatG}
        pct={fatPct}
        colorClass="bg-amber-500"
      />
      <MacroBar
        label="Carbos"
        consumed={consumed.carbsG}
        target={targets.carbsG}
        pct={carbsPct}
        colorClass="bg-emerald-500"
      />
    </div>
  );
}
