import { NavLink } from "react-router-dom";
import {
    Dumbbell,
    LayoutDashboard,
    Sparkles,
    Trophy,
    UtensilsCrossed,
    X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DASHBOARD_PATH } from "../../lib/routes";

const links = [
    { label: "Inicio", path: DASHBOARD_PATH, icon: LayoutDashboard, end: true },
    { label: "Entreno", path: "/workouts", icon: Dumbbell },
    { label: "Comidas", path: "/meals", icon: UtensilsCrossed },
    { label: "Insights", path: "/insights", icon: Sparkles },
    { label: "Logros", path: "/achievements", icon: Trophy },
];

export default function Sidebar({ open = false, onClose }) {
    const { user } = useAuth();
    const displayName = user?.name?.trim() || "Atleta";
    const avatarSrc = user?.avatarUrl?.trim() || "/avatar-placeholder.svg";

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-30 bg-black/60 transition-opacity duration-300 ease-out lg:hidden ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!open}
            />

            <aside
                className={`sidebar-pill sidebar-pill--drawer transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)] lg:translate-x-0"
                }`}
                aria-label="Navegación principal"
            >
                <div className="relative flex h-full w-full flex-col items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute -end-1 -top-1 touch-target rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>

                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        title={`Perfil de ${displayName}`}
                        aria-label={`Ir a perfil de ${displayName}`}
                        className={({ isActive }) =>
                            `sidebar-avatar touch-target ${isActive ? "sidebar-avatar--active" : ""}`
                        }
                    >
                        <img src={avatarSrc} alt={displayName} />
                    </NavLink>

                    <nav className="sidebar-nav">
                        {links.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.end}
                                    onClick={onClose}
                                    title={link.label}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item touch-target ${
                                            isActive ? "sidebar-nav-item--active" : ""
                                        }`
                                    }
                                >
                                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
