import api from "./api";

export async function fetchProfile() {
  const { data } = await api.get("/profile");
  return data;
}

export async function saveProfile(payload) {
  const { data } = await api.put("/profile", payload);
  return data;
}

export async function logWeight(weightKg) {
  const { data } = await api.post("/profile/weight", { weightKg });
  return data;
}
