// middleware/notFound.js
// Captura cualquier ruta que no coincida con las definidas.
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};