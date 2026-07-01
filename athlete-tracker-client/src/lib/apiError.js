/**
 * Mensaje legible desde respuestas Axios del backend (Express / errorHandler).
 * @param {unknown} error
 * @param {string} fallback
 */
export function getApiErrorMessage(error, fallback) {
  if (!error?.response) {
    if (error?.code === "ERR_NETWORK") {
      return "No se pudo conectar con el servidor. Revisá que la API esté deployada en Vercel (Root Directory = raíz del repo) y que las variables TURSO_* y JWT_SECRET estén configuradas.";
    }
    return fallback;
  }

  const data = error.response.data;
  if (!data) return fallback;

  if (typeof data.error === "string") return data.error;
  if (data.error?.message) return data.error.message;
  if (typeof data.message === "string") return data.message;

  return fallback;
}
