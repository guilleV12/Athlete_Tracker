import { NavLink, useMatch } from "react-router-dom";
import {
    Dumbbell,
    LayoutDashboard,
    Sparkles,
    Trophy,
    UtensilsCrossed,
} from "lucide-react";

const tabs = [
    {
        path: "/",
        end: true,
        icon: LayoutDashboard,
        ariaLabel: "Inicio",
    },
    {
        path: "/workouts",
        end: false,
        icon: Dumbbell,
        ariaLabel: "Workouts",
    },
    {
        path: "/meals",
        end: false,
        icon: UtensilsCrossed,
        ariaLabel: "Comidas",
    },
    {
        path: "/insights",
        end: false,
        icon: Sparkles,
        ariaLabel: "Insights",
    },
    {
        path: "/achievements",
        end: false,
        icon: Trophy,
        ariaLabel: "Logros",
    },
];

function BottomTab({ path, end, icon: Icon, ariaLabel, onNavigate }) {
    const match = useMatch({ path, end: end ?? false });
    const isActive = match !== null;

    return (
        <li className="min-w-0 flex-1">
            <NavLink
                to={path}
                end={end}
                title={ariaLabel}
                aria-label={ariaLabel}
                onClick={() => onNavigate?.()}
                className={`touch-target flex min-h-[var(--mobile-nav-height)] flex-col items-center justify-center rounded-xl px-1 py-1.5 transition active:scale-95 ${
                    isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text)] hover:text-[var(--text-h)]"
                }`}
            >
                <span
                    className={`rounded-full p-1.5 transition ${
                        isActive
                            ? "nav-tab-active bg-[var(--accent-bg)] ring-2 ring-[var(--accent-border)]"
                            : "bg-transparent"
                    }`}
                >
                    <Icon
                        size={20}
                        strokeWidth={isActive ? 2.25 : 2}
                        aria-hidden="true"
                    />
                </span>
            </NavLink>
        </li>
    );
}

export default function MobileBottomNav({ onNavigate }) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-[var(--border)] bg-[var(--surface)]/95 pb-[env(safe-area-inset-bottom,0px)] pt-0 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface)]/92 md:hidden"
            aria-label="Navegación principal"
        >
            <ul className="flex w-full items-stretch justify-between gap-0.5 px-1">
                {tabs.map((tab) => (
                    <BottomTab key={tab.path} {...tab} onNavigate={onNavigate} />
                ))}
            </ul>
        </nav>
    );
}
