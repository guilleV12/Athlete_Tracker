import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/** Re-anima el contenido al cambiar de ruta dentro del layout autenticado. */
export default function PageTransition() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-page-enter">
      <Outlet />
    </div>
  );
}
