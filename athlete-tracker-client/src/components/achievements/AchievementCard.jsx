import { Lock, Trophy } from "lucide-react";

const CATEGORY_LABELS = {
  workouts: "Entrenamiento",
  nutrition: "Nutrición",
  profile: "Perfil",
  general: "General",
};

function formatUnlockedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AchievementCard({ item, locked = false }) {
  const name = item?.name ?? "Logro";
  const description = item?.description;
  const categoryLabel = CATEGORY_LABELS[item?.category] ?? item?.category;
  const unlockedLabel = formatUnlockedDate(item?.unlockedAt);

  return (
    <article
      className={`quest-card card-interactive flex h-full flex-col p-5 pt-6 text-start ${
        locked
          ? "opacity-[0.92] saturate-[0.65]"
          : "achievement-card"
      }`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {categoryLabel ? (
            <p className="text-xs font-medium text-[var(--text)]">
              {categoryLabel}
            </p>
          ) : null}
          <h2 className="text-lg font-semibold text-[var(--text-h)]">{name}</h2>
        </div>
        <span
          className={`flex shrink-0 items-center justify-center rounded-full p-2 ${
            locked
              ? "bg-[var(--code-bg)] text-[var(--text)]"
              : "bg-[var(--gold-bg)] text-[var(--gold)]"
          }`}
          aria-hidden="true"
        >
          {locked ? <Lock size={20} /> : <Trophy size={22} />}
        </span>
      </header>

      {description ? (
        <p className="flex-1 text-sm leading-relaxed text-[var(--text)] sm:text-base">
          {description}
        </p>
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            locked
              ? "border border-dashed border-[var(--border)] text-[var(--text)]"
              : "badge-gold"
          }`}
        >
          {locked ? "Por conseguir" : "Desbloqueado"}
        </span>
        {!locked && unlockedLabel ? (
          <time
            dateTime={item.unlockedAt}
            className="text-xs text-[var(--text)]"
          >
            {unlockedLabel}
          </time>
        ) : null}
      </footer>
    </article>
  );
}
