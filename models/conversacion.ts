import mongoose, { Schema, model, models } from 'mongoose';

const conversacionSchema = new Schema({
  participantes: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  creadoEn: { type: Date, default: Date.now }
});

const Conversacion = models.Conversacion || model('Conversacion', conversacionSchema);
export default Conversacion;
