import { AppError } from "../lib/AppError.js";

/**
 * 404: rutas no registradas. Debe ir **después** de todas las rutas.
 * @param {import('express').Request} _req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
export function notFound(_req, _res, next) {
  next(new AppError("Ruta no encontrada", 404));
}
