import axios from "axios";
import { AUTH_TOKEN_KEY } from "../lib/authSession.js";
import { emitSessionExpired } from "../lib/authEvents.js";

const rawBase =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const baseURL = String(rawBase).replace(/\/$/, "");

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
