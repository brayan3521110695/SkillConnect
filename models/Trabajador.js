import mongoose from 'mongoose';

const TrabajadorSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  especialidad: String,
  calificacion: Number,
  certificaciones: [String],
  fechaRegistro: Date,
}, { collection: 'trabajadors' }); // 👈 usa el nombre exacto de tu colección

export default mongoose.models.Trabajador || mongoose.model('Trabajador', TrabajadorSchema);
