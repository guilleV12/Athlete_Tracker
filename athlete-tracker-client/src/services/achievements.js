import api from "./api";

export async function listAchievements() {
  const { data } = await api.get("/achievements");
  if (data?.catalog) {
    return data;
  }
  return { catalog: [], summary: { unlocked: 0, total: 0 } };
}
