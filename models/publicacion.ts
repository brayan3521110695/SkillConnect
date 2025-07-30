import mongoose, { Schema, model, models } from 'mongoose';

const PublicacionSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, required: true },
  precio: { type: String, required: true },
  disponibilidad: { type: String, required: true },
  fecha: { type: String, required: true },
  likes: { type: Number, default: 0 },
  trabajadorId: {
    type: Schema.Types.ObjectId,
    ref: 'Trabajador',
    required: true,
  },
}, { timestamps: true });

export default models.Publicacion || model('Publicacion', PublicacionSchema);
