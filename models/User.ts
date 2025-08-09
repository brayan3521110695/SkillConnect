import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  nombre: { type: String },
  email: { type: String, unique: true, required: true },
  image: { type: String }, // campo para la foto
  // otros campos...
}, { timestamps: true });

export default models.User || model('User', UserSchema);
