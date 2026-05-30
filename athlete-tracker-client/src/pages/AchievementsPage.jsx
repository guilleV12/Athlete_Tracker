import useAchievements from "../hooks/useAchievements";
import AchievementsGrid from "../components/achievements/AchievementsGrid";
import GridPageSkeleton from "../components/ui/skeletons/GridPageSkeleton";

export default function AchievementsPage() {
  const { unlocked, locked, summary, loading, error, refetch } =
    useAchievements();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-[var(--accent)]">Progreso</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
          Logros
        </h1>
        <p className="max-w-2xl text-[var(--text)]">
          Desbloqueá medallas por entrenar, registrar comidas y cumplir tus metas
          calóricas.{" "}
          {!loading && summary.total > 0 ? (
            <span className="font-medium text-[var(--text-h)]">
              {summary.unlocked} de {summary.total} conseguidos.
            </span>
          ) : null}
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
        <GridPageSkeleton label="Cargando logros" cardHeight="h-44" />
      ) : (
        <AchievementsGrid unlocked={unlocked} locked={locked} />
      )}
    </div>
  );
}
