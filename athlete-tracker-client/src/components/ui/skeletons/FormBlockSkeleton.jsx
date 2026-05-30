import Skeleton from "../Skeleton";

/** Placeholder del formulario en páginas CRUD mientras carga la lista. */
export default function FormBlockSkeleton() {
  return (
    <div
      className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6"
      aria-hidden="true"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  );
}
