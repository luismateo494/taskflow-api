// config/db.js
// ------------------------------------------------------------
// Conexión única a MongoDB al iniciar el servidor.
// Usa dbName y pool de conexiones.
// ------------------------------------------------------------

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    if (!uri) throw new Error('MONGO_URI no está definida en .env');
    if (!dbName) throw new Error('DB_NAME no está definida en .env');

    await mongoose.connect(uri, {
      dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB conectado a la BD "${dbName}"`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
