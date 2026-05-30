import AchievementCard from "./AchievementCard";

function AchievementSection({ id, title, description, items, locked }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4" aria-labelledby={id}>
      <div>
        <h2
          id={id}
          className="text-lg font-semibold text-[var(--text-h)] sm:text-xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--text)]">{description}</p>
        ) : null}
      </div>
      <div className="stagger-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <AchievementCard key={item.id} item={item} locked={locked} />
        ))}
      </div>
    </section>
  );
}

export default function AchievementsGrid({ unlocked = [], locked = [] }) {
  const hasAny = unlocked.length > 0 || locked.length > 0;

  if (!hasAny) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-10 text-center text-sm text-[var(--text)]">
        No hay logros configurados todavía. Ejecutá el seed del servidor.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <AchievementSection
        id="achievements-unlocked-heading"
        title="Obtenidos"
        description={
          unlocked.length
            ? `${unlocked.length} logro${unlocked.length === 1 ? "" : "s"} desbloqueado${unlocked.length === 1 ? "" : "s"}.`
            : null
        }
        items={unlocked}
        locked={false}
      />

      {unlocked.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] px-4 py-6 text-center text-sm text-[var(--text)]">
          Aún no desbloqueaste ninguno. Registrá tu primer entrenamiento o comida
          para empezar.
        </p>
      ) : null}

      <AchievementSection
        id="achievements-locked-heading"
        title="Por conseguir"
        description="Seguí entrenando, registrando comidas y completando tu perfil."
        items={locked}
        locked
      />
    </div>
  );
}
