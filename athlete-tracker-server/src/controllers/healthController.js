import { prisma } from "../lib/prisma.js";

/**
 * Raíz: útil para comprobar que el proceso levanta (sin tocar la BD).
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export function getRoot(_req, res) {
  res.json({
    message: "API Athlete Tracker",
    docs: { health: "GET /api/v1/health" },
  });
}

/**
 * Health check con `SELECT 1` para verificar conexión a Postgres.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export async function getHealth(_req, res) {
  const tursoConfigured = Boolean(
    process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
  );
  const started = Date.now();

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
      tursoConfigured,
      responseMs: Date.now() - started,
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      tursoConfigured,
      hint: tursoConfigured
        ? "Token Turso inválido o tablas sin crear. Regenerá un token con permiso de escritura y corré npm run db:sync:turso + npm run seed."
        : "Configurá TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en Vercel → Environment Variables.",
    });
  }
}
