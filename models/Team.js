// models/Team.js
// ------------------------------------------------------------
// Modelo Team: representa un equipo (Backend, Frontend, etc.)
// Relación: 1 Team → N Users, 1 Team → N Tasks
// ------------------------------------------------------------

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del equipo es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [40, 'El nombre no puede superar 40 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'La descripción no puede superar 200 caracteres'],
      default: 'Sin descripción',
    },
  },
  {
    timestamps: true,           // agrega createdAt y updatedAt
    strict: false,              // permite campos extra que ya existan
    collection: 'Teams',        // ⚠️ usar la colección "Teams" (con mayúscula)
  }
);

module.exports = mongoose.model('Team', teamSchema);
