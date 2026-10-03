// controllers/taskController.js
// ------------------------------------------------------------
// CRUD de Tasks + filtros + paginación + aggregation + $lookup.
// ------------------------------------------------------------

const Task = require('../models/Task');
const AppError = require('../utils/AppError');

// GET /api/tasks
// Acepta: ?status=...&priority=...&team=...&email=...&sort=...&page=1&limit=10
exports.getTasks = async (req, res, next) => {
  try {
    const {
      status, priority, team, email,
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    // Construir filtro dinámico
    const filter = {};
    if (status)   filter.status = status;
    if (priority) filter.priority = priority;
    if (team)     filter.team = team;
    if (email)    filter.email = email.toLowerCase();

    // Paginación
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Ejecutar consulta + conteo total en paralelo
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('teamId', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.json({
      status: 'success',
      results: tasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tasks,
    });
  } catch (err) { next(err); }
};

// GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('teamId', 'name description');
    if (!task) return next(new AppError('Tarea no encontrada', 404));
    res.json({ status: 'success', data: task });
  } catch (err) { next(err); }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ status: 'success', data: task });
  } catch (err) { next(err); }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return next(new AppError('Tarea no encontrada', 404));
    res.json({ status: 'success', data: task });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return next(new AppError('Tarea no encontrada', 404));
    res.status(204).send();
  } catch (err) { next(err); }
};

// ------------------------------------------------------------
// GET /api/tasks/stats/by-team
// Aggregation Pipeline: cantidad de tareas por equipo y estado
// ------------------------------------------------------------
exports.getStatsByTeam = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      // 1. Filtramos tareas sin team
      { $match: { team: { $ne: null } } },

      // 2. Agrupamos por team + status
      {
        $group: {
          _id: { team: '$team', status: '$status' },
          total: { $sum: 1 },
        },
      },

      // 3. Proyección limpia
      {
        $project: {
          _id: 0,
          team: '$_id.team',
          status: '$_id.status',
          total: 1,
        },
      },

      // 4. Ordenamiento
      { $sort: { team: 1, total: -1 } },
    ]);

    res.json({ status: 'success', results: stats.length, data: stats });
  } catch (err) { next(err); }
};

// ------------------------------------------------------------
// GET /api/tasks/with-relations
// $lookup con Teams (por teamId) y con Users (por email)
// ------------------------------------------------------------
exports.getTasksWithRelations = async (req, res, next) => {
  try {
    const tasks = await Task.aggregate([
      // 1. Join con Teams por teamId (ObjectId → _id)
      {
        $lookup: {
          from: 'Teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'teamInfo',
        },
      },
      { $unwind: { path: '$teamInfo', preserveNullAndEmptyArrays: true } },

      // 2. Join con Users por email
      {
        $lookup: {
          from: 'Users',
          localField: 'email',
          foreignField: 'email',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },

      // 3. Proyección final
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          priority: 1,
          email: 1,
          team: 1,
          assignedTo: 1,
          teamName: '$teamInfo.name',
          teamDescription: '$teamInfo.description',
          assignedName: '$userInfo.name',
          assignedRole: '$userInfo.role',
        },
      },
    ]);

    res.json({ status: 'success', results: tasks.length, data: tasks });
  } catch (err) { next(err); }
};