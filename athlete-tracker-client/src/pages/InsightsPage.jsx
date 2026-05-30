import useInsights from "../hooks/useInsights";
import InsightsGrid from "../components/insights/InsightsGrid";
import GridPageSkeleton from "../components/ui/skeletons/GridPageSkeleton";

export default function InsightsPage() {
  const { insights, loading, error, refetch } = useInsights();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-[var(--accent)]">
          Análisis
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
          Insights
        </h1>
        <p className="max-w-2xl text-[var(--text)]">
          Recomendaciones según tus entrenamientos y comidas recientes.
        </p>
      </header>

      {error ? (
        <div
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-start sm:flex-row sm:items-center sm:justify-between dark:border-red-900/40 dark:bg-red-950/30"
          role="alert"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="btn-press btn-quest shrink-0 rounded-xl px-4 py-2 text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {loading ? (
        <GridPageSkeleton label="Cargando insights" cardHeight="h-40" />
      ) : (
        <InsightsGrid insights={insights} />
      )}
    </div>
  );
}
