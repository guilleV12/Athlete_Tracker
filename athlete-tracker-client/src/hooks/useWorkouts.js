import { createWorkout, listWorkouts } from "../services/workouts";
import useResource from "./useResource";

export default function useWorkouts() {
  const { items, ...rest } = useResource({
    list: listWorkouts,
    create: createWorkout,
    listErrorFallback: "No se pudieron cargar los entrenamientos.",
  });

  return { workouts: items, ...rest };
}
