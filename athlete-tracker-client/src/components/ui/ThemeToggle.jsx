import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS = {
  light: "Tema claro",
  dark: "Tema oscuro",
  system: "Usar tema del sistema",
};

export default function ThemeToggle({ className = "", layout = "default" }) {
  const { preference, cycleTheme } = useTheme();
  const Icon = ICONS[preference] ?? Monitor;
  const label = LABELS[preference] ?? LABELS.system;

  if (layout === "sidebar") {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`sidebar-nav-item touch-target w-full max-w-[4.25rem] border-0 bg-transparent ${className}`}
        aria-label={label}
        title={label}
      >
        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        <span>Tema</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`btn-press touch-target inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-h)] transition hover:bg-[var(--code-bg)] ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
