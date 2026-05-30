import { useCallback, useEffect, useState } from "react";
import { listInsights } from "../services/insights";
import { getApiErrorMessage } from "../lib/apiError";

export default function useInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await listInsights();
      setInsights(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "No se pudieron cargar los insights.")
      );
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { insights, loading, error, refetch };
}
