import { Link } from "react-router-dom";

const STEPS = [
  "Fecha de nacimiento, sexo, peso y altura",
  "Nivel de actividad y objetivo (mantenimiento, déficit, superávit o comer libre)",
  "Guardá el perfil para ver BMR, TDEE y meta en el dashboard",
];

export default function ProfileOnboardingBanner({
  userName,
  from = "register",
  onSkip,
}) {
  const title =
    from === "register"
      ? `¡Bienvenido${userName ? `, ${userName}` : ""}!`
      : "Completá tu perfil";

  const subtitle =
    from === "register"
      ? "Un paso más y calculamos tus calorías diarias según tu cuerpo y tu objetivo."
      : "Personalizá tu plan para ver metas calóricas y progreso del día en el dashboard.";

  return (
    <section
      className="quest-card mb-8 space-y-4 border-[var(--accent-border)] bg-[var(--accent-bg)] p-5 sm:p-6"
      aria-labelledby="onboarding-heading"
    >
      <div className="space-y-2 text-start">
        <p className="text-sm font-bold text-[var(--accent)]">Primeros pasos</p>
        <h2
          id="onboarding-heading"
          className="text-lg font-semibold text-[var(--text-h)] sm:text-xl"
        >
          {title}
        </h2>
        <p className="text-sm text-[var(--text-h)]">{subtitle}</p>
      </div>

      <ol className="list-decimal space-y-2 ps-5 text-sm text-[var(--text-h)]">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onSkip}
          className="btn-press rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium text-[var(--text-h)] hover:border-[var(--accent-border)]"
        >
          Explorar el dashboard
        </button>
        <p className="text-xs text-[var(--text)] sm:ms-auto">
          Podés completar el perfil más tarde desde{" "}
          <Link to="/profile" className="font-medium text-[var(--accent)] hover:underline">
            Perfil
          </Link>{" "}
          o el banner del inicio.
        </p>
      </div>
    </section>
  );
}
