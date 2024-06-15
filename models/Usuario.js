
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['Administrador', 'Docente'] }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
