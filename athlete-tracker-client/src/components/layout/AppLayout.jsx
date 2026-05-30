import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PageTransition from "../ui/PageTransition";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    useEffect(() => {
        if (!sidebarOpen) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape") closeSidebar();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [sidebarOpen]);

    useEffect(() => {
        if (!sidebarOpen) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [sidebarOpen]);

    return (
        <div className="app-shell app-shell--with-pill min-h-screen">
            <Navbar onMenuClick={openSidebar} />

            <div className="min-h-[calc(100svh-1px)] lg:flex lg:gap-5 lg:px-4 lg:pb-4">
                <Sidebar open={sidebarOpen} onClose={closeSidebar} />

                <div className="flex min-w-0 flex-1 flex-col">
                    <main className="flex-1 pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px))] md:pb-0">
                        <PageTransition />
                    </main>

                    <MobileBottomNav onNavigate={closeSidebar} />
                </div>
            </div>
        </div>
    );
}
