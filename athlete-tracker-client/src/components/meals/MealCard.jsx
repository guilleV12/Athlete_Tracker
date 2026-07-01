function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function MealCard({ meal }) {
    const dateLabel = formatDate(meal.date);
    const hasMacros =
        meal.proteinG != null || meal.carbsG != null || meal.fatG != null;

    return (
        <article className="quest-card card-interactive flex h-full flex-col gap-3 p-6 pt-7 text-start">
            <header className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--text-h)]">
                    {meal.type}
                </h3>
                {dateLabel ? (
                    <span className="shrink-0 text-xs text-[var(--text)]">
                        {dateLabel}
                    </span>
                ) : null}
            </header>

            <dl className="space-y-2 text-sm">
                <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--text)]">
                        Calorías
                    </dt>
                    <dd className="font-medium text-[var(--text-h)]">
                        {meal.calories} kcal
                    </dd>
                </div>
                {hasMacros ? (
                    <div>
                        <dt className="text-xs uppercase tracking-wide text-[var(--text)]">
                            Macros
                        </dt>
                        <dd className="font-medium text-[var(--text-h)]">
                            P {meal.proteinG ?? 0} g · C {meal.carbsG ?? 0} g · G{" "}
                            {meal.fatG ?? 0} g
                        </dd>
                    </div>
                ) : null}
            </dl>
        </article>
    );
}
