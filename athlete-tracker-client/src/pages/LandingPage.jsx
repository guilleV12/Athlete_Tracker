import { Link, Navigate } from "react-router-dom";
import {
  Dumbbell,
  LineChart,
  Sparkles,
  Target,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { DASHBOARD_PATH } from "../lib/routes";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Entrenamientos",
    text: "Registrá sesiones, intensidad y progreso semanal en gráficos.",
  },
  {
    icon: Target,
    title: "Metas calóricas",
    text: "Perfil con Mifflin-St Jeor, macros P/C/G y modos déficit o superávit.",
  },
  {
    icon: Trophy,
    title: "Logros",
    text: "Desbloqueá medallas por entrenar, comer en meta y completar tu perfil.",
  },
];

const HIGHLIGHTS = [
  { icon: UtensilsCrossed, label: "Comidas del día" },
  { icon: LineChart, label: "Historial de peso" },
  { icon: Sparkles, label: "Insights personalizados" },
];

export default function LandingPage() {
  const { user, token, loading } = useAuth();

  if (!loading && user && token) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  return (
    <div className="animate-page-enter min-h-screen bg-[var(--code-bg)] text-start">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <p className="text-lg font-bold tracking-tight text-[var(--text-h)]">
          Athlete Tracker
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="btn-press rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-h)] hover:bg-[var(--surface)] sm:px-4"
          >
            Ingresar
          </Link>
          <Link
            to="/register"
            className="btn-press btn-quest rounded-xl px-3 py-2 text-sm sm:px-4"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-24">
        <section className="quest-card mx-auto max-w-3xl space-y-6 p-6 text-center sm:p-10 lg:p-12">
          <p className="page-hero-eyebrow">Tu progreso, en un solo lugar</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl lg:text-5xl">
            Entrená, comé mejor y seguí tus metas como un juego
          </h1>
          <p className="mx-auto max-w-xl text-base text-[var(--text)] sm:text-lg">
            App full-stack para atletas: workouts, calorías, perfil nutricional,
            logros y dashboard con insights. Diseño oscuro, rápido y claro.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              to="/register"
              className="btn-press btn-quest min-h-11 w-full rounded-xl px-6 py-3 text-base sm:w-auto"
            >
              Empezar gratis
            </Link>
            <Link
              to="/login"
              className="btn-press min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-6 py-3 text-base font-medium text-[var(--text-h)] hover:border-[var(--accent-border)] sm:w-auto"
            >
              Ya tengo cuenta
            </Link>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs text-[var(--text)] sm:text-sm">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-3 py-1.5"
              >
                <Icon size={14} className="text-[var(--accent)]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Características
          </h2>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="quest-card card-interactive p-5 sm:p-6"
            >
              <span
                className="mb-4 inline-flex rounded-xl bg-[var(--accent-bg)] p-2.5 text-[var(--accent)]"
                aria-hidden
              >
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-h)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">
                {text}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text)]">
        Athlete Tracker — proyecto de portafolio full-stack
      </footer>
    </div>
  );
}
