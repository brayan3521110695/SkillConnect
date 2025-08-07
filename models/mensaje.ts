import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IMensaje extends Document {
  conversacion: mongoose.Types.ObjectId;
  de: mongoose.Types.ObjectId;
  tipoUsuario: 'Cliente' | 'Trabajador';
  contenido: string;
  creadoEn: Date;
  leido: boolean;
}

const mensajeSchema = new Schema<IMensaje>(
  {
    conversacion: {
      type: Schema.Types.ObjectId,
      ref: 'Conversacion',
      required: true,
    },
    de: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'tipoUsuario', // Apunta dinámicamente al modelo Cliente o Trabajador
    },
    tipoUsuario: {
      type: String,
      required: true,
      enum: ['Cliente', 'Trabajador'], // Debe coincidir exactamente con los nombres de tus modelos
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    creadoEn: {
      type: Date,
      default: Date.now,
    },
    leido: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Mensaje = models.Mensaje || model<IMensaje>('Mensaje', mensajeSchema);
export default Mensaje;
