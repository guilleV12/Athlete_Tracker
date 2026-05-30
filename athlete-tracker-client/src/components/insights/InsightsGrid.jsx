import InsightCard from "./InsightCard";

export default function InsightsGrid({ insights }) {
  const list = Array.isArray(insights) ? insights : [];

  if (list.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-10 text-center text-sm text-[var(--text)]">
        Todavía no hay insights. Registrá entrenamientos y comidas para ver
        sugerencias aquí.
      </p>
    );
  }

  return (
    <section aria-labelledby="insights-grid-heading">
      <h2 id="insights-grid-heading" className="sr-only">
        Lista de insights
      </h2>
      <div className="stagger-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((insight, index) => (
          <InsightCard
            key={`${insight.type}-${index}`}
            insight={insight}
          />
        ))}
      </div>
    </section>
  );
}
