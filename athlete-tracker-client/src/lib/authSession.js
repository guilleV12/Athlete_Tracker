/** Claves únicas para token/usuario (un solo lugar para api + context). */
export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function readStoredSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);
  return { token, userRaw };
}
