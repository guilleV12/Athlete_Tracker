/**
 * Error HTTP controlado: úsalo en controladores (throw new AppError('...', 404))
 * y el `errorHandler` lo convertirá en JSON con el status correcto.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
