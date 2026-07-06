import axios from "axios";
import { AUTH_TOKEN_KEY } from "../lib/authSession.js";
import { emitSessionExpired } from "../lib/authEvents.js";

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL;

  if (import.meta.env.PROD) {
    // Ignorar localhost en prod (VITE_API_URL mal seteada en Vercel).
    if (fromEnv && !/localhost|127\.0\.0\.1/.test(fromEnv)) {
      return String(fromEnv).replace(/\/$/, "");
    }
    return "/api/v1";
  }

  return fromEnv ?? "http://localhost:3000/api/v1";
}

const baseURL = resolveApiBaseUrl();

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? "");

    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      emitSessionExpired();
    }

    return Promise.reject(error);
  }
);

export default api;
