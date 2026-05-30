/**
 * Carga y valida variables de entorno mínimas para el server.
 * Se importa solo desde `server.js` (al inicio) para que el resto del código
 * herede un proceso con env ya resuelto.
 */
import { config } from "dotenv";

const result = config();
if (result.error && process.env.NODE_ENV !== "production") {
  console.warn("[env] .env not loaded or missing:", result.error.message);
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
