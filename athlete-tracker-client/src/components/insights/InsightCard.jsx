import { Sparkles } from "lucide-react";

const typeStyles = {
  warning:
    "border-amber-500/35 bg-amber-500/[0.08] dark:border-amber-500/25 dark:bg-amber-500/10",
  performance:
    "border-sky-500/35 bg-sky-500/[0.08] dark:border-sky-500/25 dark:bg-sky-500/10",
  success:
    "border-emerald-500/35 bg-emerald-500/[0.08] dark:border-emerald-500/25 dark:bg-emerald-500/10",
  motivation:
    "border-[var(--accent-border)] bg-[var(--accent-bg)]",
};

const typeLabel = {
  warning: "Alerta",
  performance: "Rendimiento",
  success: "Logro",
  motivation: "Motivación",
};

export default function InsightCard({ insight }) {
  const variant = insight?.type ?? "motivation";
  const shell =
    typeStyles[variant] ??
    "border-[var(--border)] bg-[var(--code-bg)]";

  return (
    <article
      className={`quest-card card-interactive flex h-full flex-col p-5 pt-7 text-start ${shell}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
          {typeLabel[variant] ?? variant}
        </h2>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text)]"
          title="Generado a partir de tus datos"
        >
          <Sparkles size={12} className="text-[var(--accent)]" aria-hidden />
          IA
        </span>
      </header>

      <p className="flex-1 text-sm leading-relaxed text-[var(--text-h)] sm:text-base">
        {insight?.message}
      </p>
    </article>
  );
}
