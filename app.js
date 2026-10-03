// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    version: '1.0.0',
    endpoints: ['/api/teams', '/api/users', '/api/tasks'],
  });
});

// ⬇️ Montar rutas
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// 404 y errores (al final)
app.use(notFound);
app.use(errorHandler);

module.exports = app;