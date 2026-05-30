import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { stripAchievementMeta } from "../lib/achievementNotifications";

/**
 * Hook genérico para listar y crear sobre un recurso REST.
 *
 * Espera funciones de servicio estables (importadas a nivel de módulo):
 *   - list:   () => Promise<T[]>
 *   - create: (payload) => Promise<T>
 *
 * Devuelve `items`, `loading`, `error`, `refetch`, `create`.
 * Los hooks de dominio (useWorkouts, useMeals, ...) lo envuelven y
 * renombran `items` al sustantivo del dominio.
 */
export default function useResource({
  list,
  create,
  listErrorFallback = "No se pudieron cargar los datos.",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, listErrorFallback));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [list, listErrorFallback]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createItem = useCallback(
    async (payload) => {
      const created = await create(payload);
      const { item, newAchievements } = stripAchievementMeta(created);
      setItems((prev) => [item, ...prev]);
      return { ...item, newAchievements };
    },
    [create]
  );

  return {
    items,
    loading,
    error,
    refetch,
    create: createItem,
  };
}
