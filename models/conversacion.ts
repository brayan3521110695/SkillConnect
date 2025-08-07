import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ObjectId } from 'mongoose';

interface IConversacion extends Document {
  participantes: ObjectId[];
  participantesModel: ('Cliente' | 'Trabajador')[];
  creadoEn: Date;
  getParticipantes(): Promise<any[]>;
}

const conversacionSchema = new Schema<IConversacion>(
  {
    participantes: [{ type: Schema.Types.ObjectId, required: true }],
    participantesModel: [{ type: String, enum: ['Cliente', 'Trabajador'], required: true }],
    creadoEn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Método corregido para traer detalles de participantes
conversacionSchema.methods.getParticipantes = async function () {
  const participantes = await Promise.all(
    this.participantes.map(async (id: ObjectId, index: number) => {
      const modelName = this.participantesModel[index];
      if (!modelName) return null;

      try {
        // 👇 Validamos y obtenemos el modelo dinámicamente
        const Model = mongoose.model(modelName);
        const data = await Model.findById(id).select('nombre avatar email');
        return data;
      } catch (error) {
        console.error(`❌ Error al obtener participante (${modelName}):`, error);
        return null;
      }
    })
  );

  return participantes.filter((p) => p !== null);
};

const Conversacion: Model<IConversacion> =
  mongoose.models.Conversacion || mongoose.model('Conversacion', conversacionSchema);

export default Conversacion;
