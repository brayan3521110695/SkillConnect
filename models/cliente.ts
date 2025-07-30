import mongoose, { Schema, model, models } from 'mongoose';

const ClienteSchema = new Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String },
  telefono: { type: String },
  direccion: { type: String },
  email: { type: String, required: true, unique: true }, // correo → email
  password: { type: String, required: true },
  foto: { type: String },
  rol: { type: String, default: 'cliente' }
}, {
  timestamps: true
});

export default models.Cliente || model('Cliente', ClienteSchema);
    