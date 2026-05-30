import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/apiError";
import StatsCard from "../components/dashboard/StatsCard";
import NutritionStatsCard from "../components/dashboard/NutritionStatsCard";
import ProfileRecommendBanner from "../components/profile/ProfileRecommendBanner";
import InsightsList from "../components/dashboard/InsightsList";
import AchievementsList from "../components/dashboard/AchievementsList";
import WeeklyWorkoutsChart from "../components/dashboard/WeeklyWorkoutsChart";
import DashboardPageSkeleton from "../components/ui/skeletons/DashboardPageSkeleton";


export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [statsRes, insightsRes, achievementsRes] = await Promise.all([
        api.get("/stats/dashboard"),
        api.get("/insights"),
        api.get("/achievements"),
      ]);

      setStats(statsRes.data);
      setInsights(insightsRes.data ?? []);
      const achievementBody = achievementsRes.data;
      const catalog = achievementBody?.catalog ?? [];
      setAchievements(
        catalog.filter((item) => item.unlocked).slice(0, 5)
      );
    } catch (err) {
      setError(
        getApiErrorMessage(err, "No se pudo cargar el panel. Probá de nuevo.")
      );
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const displayName = user?.name?.trim() || "Atleta";
  const showProfileBanner =
    stats?.nutrition && !stats.nutrition.profileCompleted && !user?.profileCompleted;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header className="mb-8 space-y-2">
        <p className="page-hero-eyebrow">
          Resumen de hoy
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
          Hola, {displayName}
        </h1>
        <p className="max-w-2xl text-[var(--text)]">
          Métricas del día, insights y logros en un solo lugar.
        </p>
      </header>

      {showProfileBanner ? <ProfileRecommendBanner /> : null}

      {error ? (
        <div
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-start sm:flex-row sm:items-center sm:justify-between dark:border-red-900/40 dark:bg-red-950/30"
          role="alert"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          <button
            type="button"
            onClick={fetchDashboard}
            className="btn-press btn-quest shrink-0 rounded-xl px-4 py-2 text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {loading ? (
        <DashboardPageSkeleton />
      ) : stats ? (
        <div className="animate-content-enter">
          <section
            className="mb-10"
            aria-labelledby="stats-heading"
          >
            <h2
              id="stats-heading"
              className="sr-only"
            >
              Estadísticas de hoy
            </h2>
            <div className="stagger-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <NutritionStatsCard nutrition={stats.nutrition} />
              <StatsCard
                title="Entrenamientos hoy"
                value={stats.today.workoutCount}
                unit="sesiones"
                description="Cantidad de workouts de hoy."
              />
              <StatsCard
                title="Intensidad media"
                value={stats.today.workoutCount > 0 ? stats.today.avgIntensity.toFixed(1) : "—"}
                description={
                  stats.today.workoutCount > 0
                    ? "Promedio de intensidad en entrenamientos de hoy."
                    : "Sin entrenamientos hoy."
                }
              />
              <StatsCard
                title="Esta semana"
                value={stats.week.workouts}
                unit="workouts"
                description="Últimos 7 días."
              />
            </div>
          </section>

          <section className="mb-10" aria-labelledby="weekly-chart-heading">
            <h2 id="weekly-chart-heading" className="sr-only">
              Workouts semanales
            </h2>
            <WeeklyWorkoutsChart data={stats.week.byDay} />
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <InsightsList insights={insights} />
            <AchievementsList achievements={achievements} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

