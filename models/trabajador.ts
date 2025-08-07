// models/trabajador.ts

import mongoose, { Schema, model, models } from 'mongoose';

const TrabajadorSchema = new Schema({
  nombre: String,
  email: String, // ← necesario para login
  password: String, // ← necesario para login
  rol: { type: String, default: 'trabajador' }, // ← necesario para roles
  profesion: String,
  avatar: String,
  categoria: String,
  titulo: String,
  precio: Number,
  descripcion: String,
  fecha: String,
  imagenes: [String],
  rating: Number,
  comentarios: Array
}, { collection: 'trabajadores' });

export default models.Trabajador || model('Trabajador', TrabajadorSchema, 'trabajadores');
