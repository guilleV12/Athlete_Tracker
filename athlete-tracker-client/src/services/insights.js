import api from "./api";

export async function listInsights() {
  const { data } = await api.get("/insights");
  return data;
}
