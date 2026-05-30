import api from "./api";

export async function listMeals() {
  const { data } = await api.get("/meals");
  return data;
}

export async function createMeal(payload) {
  const { data } = await api.post("/meals", payload);
  return data;
}
