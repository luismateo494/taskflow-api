// models/Task.js
// ------------------------------------------------------------
// Modelo Task: representa una tarea del proyecto.
// Relación: N Tasks → 1 Team (teamId) y N Tasks → 1 User (email)
// ------------------------------------------------------------

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [120, 'El título no puede superar 120 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
    },
    status: {
      type: String,
      // ⚠️ enum ampliado: acepta TODAS las variantes que existen en tu BD
      enum: {
        values: [
          'pending', 'Pending', 'PENDING',
          'in_progress', 'in_Progress', 'In-Progress', 'in-progress',
          'todo', 'To-Do', 'TODO',
          'done', 'Done', 'DONE',
          'completed', 'Completed', 'COMPLETED',
        ],
        message: 'El estado "{VALUE}" no es válido',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      // ⚠️ en tu BD son strings con mayúscula inicial
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'La prioridad "{VALUE}" no es válida',
      },
      default: 'Medium',
    },
    assignedTo: {
      type: String,               // ⚠️ nombre del usuario, string
      default: null,
    },
    team: {
      type: String,               // ⚠️ "Backend" / "Frontend"
      default: null,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',                // ✅ referencia real
      default: null,
    },
    email: {
      type: String,               // 🔑 campo clave para hacer $lookup con Users
      lowercase: true,
      trim: true,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    sprint: {
      type: String,               // campo extra existente en tu BD
    },
    priodidad: {
      type: Number,               // ⚠️ typo real en tu BD, lo conservamos
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'Tasks',
  }
);

// Índices para acelerar las consultas más comunes
taskSchema.index({ teamId: 1, status: 1 });
taskSchema.index({ email: 1 });

module.exports = mongoose.model('Task', taskSchema);