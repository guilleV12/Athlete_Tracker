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
  const started = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "ok",
    database: "connected",
    responseMs: Date.now() - started,
  });
}
