import mongoose, { Schema, model, models } from 'mongoose';

const TrabajadorSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profesion: { type: String },
  descripcion: { type: String },
  imagen: { type: String },
  rol: { type: String, default: 'trabajador' },
}, { timestamps: true });

export default models.Trabajador || model('Trabajador', TrabajadorSchema);
