/**
 * Envolsura un handler async: Express no captura promesas rechazadas;
 * con esto delegamos a `errorHandler` con `next(err)`.
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<unknown>} fn
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
