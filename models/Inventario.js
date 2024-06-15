const { Schema, model } = require('mongoose');

const InventarioSchema = new Schema({
  serial: { type: String, required: true, unique: true },
  modelo: { type: String, required: true, unique: true },
  descripcion: { type: String },
  foto: { type: String }, // URL of the image
  color: { type: String },
  fechaCompra: { type: Date, required: true },
  precio: { type: Number, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Reference to active user
  marca: { type: Schema.Types.ObjectId, ref: 'Marca', required: true }, // Reference to active brand
  estadoEquipo: { type: Schema.Types.ObjectId, ref: 'EstadoEquipo', required: true }, // Reference to equipment state
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

InventarioSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

module.exports = model('Inventario', InventarioSchema);
