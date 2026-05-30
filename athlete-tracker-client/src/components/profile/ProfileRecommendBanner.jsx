import { Link } from "react-router-dom";

export default function ProfileRecommendBanner() {
  return (
    <div
      className="quest-card mb-8 flex flex-col gap-4 border-[var(--accent-border)] bg-[var(--accent-bg)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      role="status"
    >
      <div className="space-y-1 text-start">
        <p className="text-sm font-bold text-[var(--accent)]">
          Personalizá tu plan
        </p>
        <p className="text-sm text-[var(--text-h)]">
          Completá tu perfil para calcular calorías según edad, peso, altura y
          objetivo (mantenimiento, déficit, superávit o comer libre).
        </p>
      </div>
      <Link
        to="/profile"
        className="btn-press btn-quest shrink-0 rounded-xl px-4 py-2.5 text-center text-sm"
      >
        Ir a perfil
      </Link>
    </div>
  );
}
