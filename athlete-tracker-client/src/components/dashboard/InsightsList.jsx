export default function InsightsList({ insights }) {
  const list = Array.isArray(insights) ? insights : [];

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 text-start shadow-[var(--shadow)]"
      aria-labelledby="insights-heading"
    >
      <div className="mb-5">
        <h2
          id="insights-heading"
          className="text-xl font-semibold text-[var(--text-h)]"
        >
          Insights
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          Resumen automático según tus datos recientes.
        </p>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-8 text-center text-sm text-[var(--text)]">
          Todavía no hay insights. Registra comidas y entrenamientos para ver
          sugerencias aquí.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((insight, index) => (
            <li
              key={`${insight.type}-${index}`}
              className="rounded-xl border border-[var(--border)] px-4 py-3 transition hover:border-[var(--accent-border)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                {insight.type}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-h)]">
                {insight.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
