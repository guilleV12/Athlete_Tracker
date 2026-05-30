import { useCallback, useEffect, useState } from "react";
import { listAchievements } from "../services/achievements";
import { getApiErrorMessage } from "../lib/apiError";

export default function useAchievements() {
  const [catalog, setCatalog] = useState([]);
  const [summary, setSummary] = useState({ unlocked: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await listAchievements();
      setCatalog(Array.isArray(data.catalog) ? data.catalog : []);
      setSummary(data.summary ?? { unlocked: 0, total: 0 });
    } catch (err) {
      setError(
        getApiErrorMessage(err, "No se pudieron cargar los logros.")
      );
      setCatalog([]);
      setSummary({ unlocked: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const unlocked = catalog.filter((item) => item.unlocked);
  const locked = catalog.filter((item) => !item.unlocked);

  return {
    catalog,
    unlocked,
    locked,
    summary,
    loading,
    error,
    refetch,
  };
}
