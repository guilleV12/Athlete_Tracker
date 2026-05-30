import { Prisma } from "@prisma/client";
import { AppError } from "../lib/AppError.js";

/**
 * Manejador final de errores. Registra el stack en desarrollo.
 * @type {import('express').ErrorRequestHandler}
 */
export function errorHandler(err, req, res, _next) {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      error: { code: err.code, message: "Error en la base de datos" },
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: { message: "Datos no válidos" },
    });
  }

  const status = typeof err?.statusCode === "number" ? err.statusCode : 500;
  const message =
    status === 500
      ? "Error interno del servidor"
      : err.message || "Error";

  return res.status(status).json({ error: { message } });
}
