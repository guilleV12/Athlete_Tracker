/**
 * Mensaje legible desde respuestas Axios del backend (Express / errorHandler).
 * @param {unknown} error
 * @param {string} fallback
 */
export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (typeof data.error === "string") return data.error;
  if (data.error?.message) return data.error.message;
  if (typeof data.message === "string") return data.message;

  return fallback;
}
