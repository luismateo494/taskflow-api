// server.js
// ------------------------------------------------------------
// Punto de entrada: carga .env, conecta MongoDB y levanta Express.
// ------------------------------------------------------------

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
    console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();