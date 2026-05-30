import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Trophy,
  X,
  XCircle,
} from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    shell:
      "border-emerald-500/35 bg-emerald-500/[0.08] dark:border-emerald-500/25 dark:bg-emerald-500/10",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: XCircle,
    shell:
      "border-red-500/35 bg-red-500/[0.08] dark:border-red-500/25 dark:bg-red-500/10",
    iconClass: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    shell:
      "border-amber-500/35 bg-amber-500/[0.08] dark:border-amber-500/25 dark:bg-amber-500/10",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    shell: "border-[var(--accent-border)] bg-[var(--accent-bg)]",
    iconClass: "text-[var(--accent)]",
  },
  achievement: {
    icon: Trophy,
    shell:
      "toast-achievement border-[var(--gold)]/50 bg-[var(--gold-bg)] shadow-[0_0_28px_rgba(234,179,8,0.22)] dark:shadow-[0_0_32px_rgba(234,179,8,0.14)]",
    iconClass: "text-[var(--gold)]",
  },
};

export default function ToastItem({ toast, onDismiss }) {
  const variant = variants[toast.type] ?? variants.info;
  const Icon = variant.icon;
  const isAchievement = toast.type === "achievement";

  return (
    <div
      role="alert"
      className={`toast-item pointer-events-auto flex w-full items-start gap-3 rounded-2xl border-2 p-4 backdrop-blur-sm ${
        isAchievement ? "max-w-md sm:max-w-lg" : "max-w-sm"
      } ${
        toast.exiting
          ? "toast-exit"
          : isAchievement
            ? "toast-achievement-enter toast-enter"
            : toast.type === "success"
              ? "toast-celebrate toast-enter"
              : "toast-enter"
      } ${variant.shell}`}
    >
      <span
        className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full ${
          isAchievement ? "bg-[var(--gold)]/15 p-2" : ""
        }`}
        aria-hidden="true"
      >
        <Icon
          size={isAchievement ? 24 : 20}
          className={variant.iconClass}
        />
      </span>
      <div className="min-w-0 flex-1 text-start">
        {toast.title ? (
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">
            {toast.title}
          </p>
        ) : null}
        <p
          className={`leading-snug text-[var(--text-h)] ${
            isAchievement ? "text-base font-semibold" : "text-sm"
          } ${toast.title ? "mt-0.5" : ""}`}
        >
          {toast.message}
        </p>
        {toast.description ? (
          <p className="mt-1 text-sm text-[var(--text)]">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-lg p-1 text-[var(--text)] transition hover:bg-black/5 hover:text-[var(--text-h)] dark:hover:bg-white/10"
        aria-label="Cerrar notificación"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
