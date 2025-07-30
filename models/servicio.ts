import mongoose, { Schema, model, models } from 'mongoose';

const ServicioSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  trabajadorId: { type: Schema.Types.ObjectId, ref: 'Trabajador' },
  precio: { type: Number },
}, { timestamps: true });

export default models.Servicio || model('Servicio', ServicioSchema);
