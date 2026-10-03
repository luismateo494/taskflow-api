// controllers/userController.js
// ------------------------------------------------------------
// CRUD de Users. Usa populate('teamId') para expandir el equipo.
// ------------------------------------------------------------

const User = require('../models/User');
const AppError = require('../utils/AppError');

// GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate('teamId', 'name description')   // expande teamId
      .sort({ createdAt: -1 });
    res.json({ status: 'success', results: users.length, data: users });
  } catch (err) { next(err); }
};

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('teamId', 'name description');
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    res.json({ status: 'success', data: user });
  } catch (err) { next(err); }
};

// POST /api/users
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (err) { next(err); }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    res.json({ status: 'success', data: user });
  } catch (err) { next(err); }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    res.status(204).send();
  } catch (err) { next(err); }
};