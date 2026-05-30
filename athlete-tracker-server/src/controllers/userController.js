import { prisma } from "../lib/prisma.js";

/**
 * Listado básico de usuarios (sin password). Patrón para el resto de recursos.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export async function listUsers(_req, res) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json({ data: users });
}
