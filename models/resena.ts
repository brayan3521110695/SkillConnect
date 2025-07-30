// models/resena.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ResenaSchema = new Schema({
  autorId: { type: String, required: true },
  nombreAutor: { type: String, required: true },
  idServicio: { type: String, required: true },
  comentario: { type: String, required: true },
  calificacion: { type: Number, min: 1, max: 5, required: true },
  fecha: { type: Date, default: Date.now },
});

export default models.Resena || model('Resena', ResenaSchema);
