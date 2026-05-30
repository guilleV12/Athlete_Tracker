import useMeals from "../hooks/useMeals";
import MealForm from "../components/meals/MealForm";
import MealList from "../components/meals/MealList";
import ResourcePageSkeleton from "../components/ui/skeletons/ResourcePageSkeleton";

export default function MealsPage() {
    const { meals, loading, error, refetch, create } = useMeals();

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <ResourcePageSkeleton label="Cargando comidas" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <header className="mb-8 space-y-2">
                <p className="text-sm font-medium text-[var(--accent)]">
                    Nutrición
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
                    Meals
                </h1>
                <p className="max-w-2xl text-[var(--text)]">
                    Registrá tus comidas y mirá tu consumo de calorías.
                </p>
            </header>

            {error ? (
                <div
                    className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-start sm:flex-row sm:items-center sm:justify-between dark:border-red-900/40 dark:bg-red-950/30"
                    role="alert"
                >
                    <p className="text-sm text-red-800 dark:text-red-200">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="btn-press btn-quest shrink-0 rounded-xl px-4 py-2 text-sm"
                    >
                        Reintentar
                    </button>
                </div>
            ) : null}

            <section className="mb-10" aria-labelledby="new-meal-heading">
                <h2 id="new-meal-heading" className="sr-only">
                    Nueva comida
                </h2>
                <MealForm onSubmit={create} />
            </section>

            <section aria-labelledby="meals-list-heading">
                <h2
                    id="meals-list-heading"
                    className="mb-4 text-xl font-semibold text-[var(--text-h)]"
                >
                    Tus comidas
                </h2>
                <MealList meals={meals} />
            </section>
        </div>
    );
}
