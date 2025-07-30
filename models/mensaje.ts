import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  conversacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversacion', required: true },
  remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false },
});

export default mongoose.models.Mensaje || mongoose.model('Mensaje', mensajeSchema);
