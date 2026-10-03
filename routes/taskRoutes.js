// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskController');

// ⚠️ Rutas especiales ANTES de /:id
router.get('/stats/by-team',   ctrl.getStatsByTeam);
router.get('/with-relations',  ctrl.getTasksWithRelations);

router
  .route('/')
  .get(ctrl.getTasks)
  .post(ctrl.createTask);

router
  .route('/:id')
  .get(ctrl.getTask)
  .put(ctrl.updateTask)
  .delete(ctrl.deleteTask);

module.exports = router;