import { createMeal, listMeals } from "../services/meals";
import useResource from "./useResource";

export default function useMeals() {
  const { items, ...rest } = useResource({
    list: listMeals,
    create: createMeal,
    listErrorFallback: "No se pudieron cargar las comidas.",
  });

  return { meals: items, ...rest };
}
