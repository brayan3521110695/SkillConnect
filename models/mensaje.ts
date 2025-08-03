import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IMensaje extends Document {
  conversacion: mongoose.Types.ObjectId;
  de: mongoose.Types.ObjectId;
  contenido: string;
  creadoEn: Date;
  leido: boolean;
}

const mensajeSchema = new Schema<IMensaje>({
  conversacion: { type: Schema.Types.ObjectId, ref: 'Conversacion', required: true },
  de: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  contenido: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false },
});

const Mensaje = models.Mensaje || model<IMensaje>('Mensaje', mensajeSchema);
export default Mensaje;
