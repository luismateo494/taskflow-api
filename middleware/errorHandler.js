// middleware/errorHandler.js
// ------------------------------------------------------------
// Middleware centralizado de errores.
// Traduce errores de Mongoose a respuestas JSON consistentes:
//   - CastError         → 400 (ID malformado)
//   - ValidationError   → 400 (campos inválidos)
//   - Duplicado (11000) → 409 (email/name repetido)
//   - AppError          → código que le hayamos puesto
//   - Cualquier otro    → 500
// ------------------------------------------------------------

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // 1. ObjectId inválido en :id → 400
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = `ID inválido: ${err.value}`;
  }

  // 2. Duplicado en campo unique → 409
  if (err.code === 11000) {
    error.statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    error.message = `Valor duplicado en "${field}": ${err.keyValue[field]}`;
  }

  // 3. Error de validación de Mongoose → 400
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
  }

  // 4. Respuesta consistente en JSON
  res.status(error.statusCode).json({
    status: error.statusCode >= 500 ? 'error' : 'fail',
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};