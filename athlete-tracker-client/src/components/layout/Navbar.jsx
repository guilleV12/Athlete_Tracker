import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { LANDING_PATH } from "../../lib/routes";

const APP_NAME = "Athlete Tracker";

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { info } = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        info("Sesión cerrada.");
        navigate(LANDING_PATH);
    };

    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const displayName = user?.name?.trim() || "Atleta";

    return (
        <header className="topbar sticky top-0 z-30 w-full border-b-2 border-[var(--border)] bg-[var(--surface)]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface)]/90">
            <div className="flex min-h-[var(--topbar-height)] items-center justify-between gap-3 px-4 py-2 sm:px-6">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="touch-target hidden rounded-lg p-2 text-[var(--text-h)] transition hover:bg-[var(--code-bg)] md:inline-flex lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu size={22} aria-hidden="true" />
                </button>

                <div className="min-w-0">
                    <p className="brand-title truncate text-base font-extrabold sm:text-lg">
                        {APP_NAME}
                    </p>
                    <p className="hidden truncate text-xs text-[var(--text)] capitalize sm:block sm:text-sm">
                        {today}
                    </p>
                </div>
                </div>

                <p
                    className="min-w-0 flex-1 truncate px-2 text-center text-sm font-semibold text-[var(--text-h)] sm:text-base"
                    title={displayName}
                >
                    {displayName}
                </p>

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn-press btn-secondary touch-target inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:px-4 sm:text-base"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
