import MealCard from "./MealCard";
import CardGridSkeleton from "../ui/skeletons/CardGridSkeleton";

export default function MealList({ meals, loading = false }) {
    const list = Array.isArray(meals) ? meals : [];

    if (loading) {
        return (
            <div role="status" aria-busy="true" aria-label="Cargando comidas">
                <CardGridSkeleton count={3} cardClassName="h-28" />
            </div>
        );
    }

    if (list.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-8 text-center text-sm text-[var(--text)]">
                Todavía no registraste comidas. Sumá la primera con el
                formulario de arriba.
            </p>
        );
    }

    return (
        <div className="stagger-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
            ))}
        </div>
    );
}
