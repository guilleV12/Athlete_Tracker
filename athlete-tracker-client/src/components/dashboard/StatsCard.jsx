export default function StatsCard({
  title,
  value,
  unit = "",
  description,
}) {
  return (
    <article className="quest-card card-interactive p-5 pt-6 text-start">
      <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[var(--text-h)] sm:text-4xl">
        {value}
        {unit ? (
          <span className="ms-1 text-xl font-medium text-[var(--text)] sm:text-2xl">
            {unit}
          </span>
        ) : null}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-snug text-[var(--text)]">
          {description}
        </p>
      ) : null}
    </article>
  );
}
