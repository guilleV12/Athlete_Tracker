import useWorkouts from "../hooks/useWorkouts";
import WorkoutForm from "../components/workouts/WorkoutForm";
import WorkoutList from "../components/workouts/WorkoutList";
import ResourcePageSkeleton from "../components/ui/skeletons/ResourcePageSkeleton";

export default function WorkoutsPage() {
    const { workouts, loading, error, refetch, create } = useWorkouts();

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <ResourcePageSkeleton label="Cargando entrenamientos" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <header className="mb-8 space-y-2">
                <p className="text-sm font-medium text-[var(--accent)]">
                    Entrenamientos
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
                    Workouts
                </h1>
                <p className="max-w-2xl text-[var(--text)]">
                    Registrá tus sesiones y mirá tu progreso.
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

            <section className="mb-10" aria-labelledby="new-workout-heading">
                <h2 id="new-workout-heading" className="sr-only">
                    Nuevo entrenamiento
                </h2>
                <WorkoutForm onSubmit={create} />
            </section>

            <section aria-labelledby="workouts-list-heading">
                <h2
                    id="workouts-list-heading"
                    className="mb-4 text-xl font-semibold text-[var(--text-h)]"
                >
                    Tus entrenamientos
                </h2>
                <WorkoutList workouts={workouts} />
            </section>
        </div>
    );
}
