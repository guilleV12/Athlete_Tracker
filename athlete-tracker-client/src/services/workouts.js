import api from "./api";

export async function listWorkouts() {
  const { data } = await api.get("/workouts");
  return data;
}

export async function createWorkout(payload) {
  const { data } = await api.post("/workouts", payload);
  return data;
}
