// controllers/teamController.js
// ------------------------------------------------------------
// CRUD de Teams.
// Todos los métodos usan async/await y delegan errores al
// middleware central con next(err).
// ------------------------------------------------------------

const Team = require('../models/Team');
const AppError = require('../utils/AppError');

// GET /api/teams
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json({ status: 'success', results: teams.length, data: teams });
  } catch (err) { next(err); }
};

// GET /api/teams/:id
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return next(new AppError('Equipo no encontrado', 404));
    res.json({ status: 'success', data: team });
  } catch (err) { next(err); }
};

// POST /api/teams
exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ status: 'success', data: team });
  } catch (err) { next(err); }
};

// PUT /api/teams/:id
exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,             // devuelve el documento actualizado
      runValidators: true,   // aplica las validaciones del esquema
    });
    if (!team) return next(new AppError('Equipo no encontrado', 404));
    res.json({ status: 'success', data: team });
  } catch (err) { next(err); }
};

// DELETE /api/teams/:id
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return next(new AppError('Equipo no encontrado', 404));
    res.status(204).send();
  } catch (err) { next(err); }
};