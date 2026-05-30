/**
 * Muestra toasts destacados por cada logro recién desbloqueado.
 */
export function notifyNewAchievements({ achievementUnlocked }, newAchievements) {
  if (!achievementUnlocked || !Array.isArray(newAchievements)) return;

  newAchievements.forEach((item, index) => {
    if (!item?.name) return;
    const show = () =>
      achievementUnlocked({
        name: item.name,
        description: item.description,
      });
    if (index === 0) {
      show();
    } else {
      window.setTimeout(show, index * 450);
    }
  });
}

export function stripAchievementMeta(record) {
  if (!record || typeof record !== "object") {
    return { item: record, newAchievements: [] };
  }
  const { newAchievements = [], ...item } = record;
  return {
    item,
    newAchievements: Array.isArray(newAchievements) ? newAchievements : [],
  };
}
