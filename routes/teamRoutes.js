// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teamController');

router
  .route('/')
  .get(ctrl.getTeams)
  .post(ctrl.createTeam);

router
  .route('/:id')
  .get(ctrl.getTeam)
  .put(ctrl.updateTeam)
  .delete(ctrl.deleteTeam);

module.exports = router;
