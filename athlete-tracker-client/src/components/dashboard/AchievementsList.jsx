import { Link } from "react-router-dom";

export default function AchievementsList({ achievements }) {
  const list = Array.isArray(achievements) ? achievements : [];

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 text-start shadow-[var(--shadow)]"
      aria-labelledby="achievements-heading"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="achievements-heading"
            className="text-xl font-semibold text-[var(--text-h)]"
          >
            Logros
          </h2>
          <p className="mt-1 text-sm text-[var(--text)]">
            Tus medallas desbloqueadas.
          </p>
        </div>
        <Link
          to="/achievements"
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-8 text-center text-sm text-[var(--text)]">
          Aún no tenés logros. Registrá un entrenamiento o una comida para el
          primero.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[var(--border)] px-4 py-3 transition hover:border-[var(--accent-border)]"
            >
              <h3 className="font-semibold text-[var(--text-h)]">
                {item.name ?? "Logro"}
              </h3>
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-[var(--text)]">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
