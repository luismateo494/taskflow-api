// utils/AppError.js
// ------------------------------------------------------------
// Clase para crear errores controlados con código HTTP personalizado.
// Uso:  throw new AppError('Mensaje', 400)
// ------------------------------------------------------------

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;   // distingue errores "esperados" de bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;