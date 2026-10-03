// models/User.js
// ------------------------------------------------------------
// Modelo User: representa a un miembro del equipo.
// Relación: N Users → 1 Team (mediante teamId ref)
// ------------------------------------------------------------

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede superar 60 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no tiene un formato válido'],
    },
    role: {
      type: String,
      enum: {
        values: ['developer', 'designer', 'devops', 'qa', 'manager'],
        message: 'El rol "{VALUE}" no es válido',
      },
      default: 'developer',
    },
    // ⚠️ En tu BD es un string ("Backend"), lo dejamos como string
    team: {
      type: String,
      default: null,
    },
    // ✅ Referencia real al Team (ObjectId)
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'Users',
  }
);

module.exports = mongoose.model('User', userSchema);
