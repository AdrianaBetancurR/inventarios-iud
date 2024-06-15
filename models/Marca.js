const { Schema, model } = require('mongoose');

const MarcaSchema = new Schema({
  nombre: { type: String, required: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

MarcaSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

module.exports = model('Marca', MarcaSchema);
