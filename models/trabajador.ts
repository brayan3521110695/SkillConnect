// models/trabajador.ts
import { Schema, model, models } from 'mongoose';

const TrabajadorSchema = new Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password:{ type: String, required: true },
  rol:     { type: String, default: 'trabajador' },
  profesion: String,
  foto:    { type: String, default: '/images/user.jpg' }, // ← unificado
  categoria: String,
  titulo: String,
  precio: Number,
  descripcion: String,
  fecha: String,
  imagenes: [String],
  rating: Number,
  comentarios: Array
}, { collection: 'trabajadores', timestamps:true });

export default models.Trabajador || model('Trabajador', TrabajadorSchema);
