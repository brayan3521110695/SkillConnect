import mongoose from 'mongoose';

const conversacionSchema = new mongoose.Schema({
  participantes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  ],
  creadaEn: { type: Date, default: Date.now },
});

export default mongoose.models.Conversacion || mongoose.model('Conversacion', conversacionSchema);
