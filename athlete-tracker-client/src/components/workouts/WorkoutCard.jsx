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

export default function WorkoutCard({ workout }) {
    const dateLabel = formatDate(workout.date);

    return (
        <article className="quest-card card-interactive flex h-full flex-col gap-3 p-6 pt-7 text-start">
            <header className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--text-h)]">
                    {workout.type}
                </h3>
                {dateLabel ? (
                    <span className="shrink-0 text-xs text-[var(--text)]">
                        {dateLabel}
                    </span>
                ) : null}
            </header>

            <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--text)]">
                        Duración
                    </dt>
                    <dd className="font-medium text-[var(--text-h)]">
                        {workout.duration} min
                    </dd>
                </div>
                <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--text)]">
                        Intensidad
                    </dt>
                    <dd className="font-medium text-[var(--text-h)]">
                        {workout.intensity}/10
                    </dd>
                </div>
            </dl>
        </article>
    );
}
