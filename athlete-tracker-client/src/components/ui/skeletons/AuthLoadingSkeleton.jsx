import Skeleton from "../Skeleton";

/** Pantalla completa mientras se restaura la sesión. */
export default function AuthLoadingSkeleton() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--code-bg)] px-4"
      role="status"
      aria-busy="true"
      aria-label="Verificando sesión"
    >
      <div className="w-full max-w-xs space-y-4" aria-hidden="true">
        <Skeleton className="mx-auto h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-3 w-48 mx-auto" />
      </div>
      <p className="sr-only">Cargando…</p>
    </div>
  );
}
