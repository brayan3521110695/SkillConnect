// scripts/migrate-trabajadores-foto.ts
import 'dotenv/config';
import mongoose, { Model, Schema } from 'mongoose';

const uri = process.env.MONGODB_URI as string; // ← cast
if (!uri) {
  console.error('❌ Falta MONGODB_URI en .env');
  process.exit(1);
}

// Modelo “flexible” solo para esta tarea
const Trabajador: Model<any> =
  mongoose.models.Trabajador ??
  mongoose.model(
    'Trabajador',
    new Schema({}, { strict: false, collection: 'trabajadores' })
  );

async function run() {
  await mongoose.connect(uri);
  console.log('✅ Conectado a Mongo');

  try {
    // 1) Copiar avatar -> foto si no existe foto
    const copiaRes = await Trabajador.updateMany(
      { foto: { $exists: false }, avatar: { $exists: true, $ne: null } },
      [{ $set: { foto: '$avatar' } }]
    );
    console.log('🔄 Copiados avatar→foto:', copiaRes.modifiedCount);

    // 2) Poner default si aún no tienen foto
    const defaultRes = await Trabajador.updateMany(
      { foto: { $exists: false } },
      { $set: { foto: '/images/user.jpg' } }
    );
    console.log('🖼️ Defaults puestos:', defaultRes.modifiedCount);

    // 3) Quitar avatar
    const unsetRes = await Trabajador.updateMany(
      { avatar: { $exists: true } },
      { $unset: { avatar: '' } }
    );
    console.log('🧹 avatar eliminado en:', unsetRes.modifiedCount);

    // 4) Índice único por email (ignora si ya existe)
    const db = mongoose.connection.db!; // ← non-null assertion
    try {
      await db
        .collection('trabajadores')
        .createIndex({ email: 1 }, { unique: true });
      console.log('🔒 Índice único por email OK');
    } catch (e: any) {
      if (e?.codeName === 'IndexOptionsConflict' || e?.code === 85) {
        console.log('ℹ️ Índice por email ya existía');
      } else {
        console.log('⚠️ No se pudo crear índice por email:', e?.message);
      }
    }

    // 5) Muestra
    const sample = await Trabajador.find({}, { nombre: 1, email: 1, foto: 1 })
      .limit(5)
      .lean();
    console.log('👀 Muestra:', sample);
  } catch (e) {
    console.error('❌ Error en migración:', e);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado');
  }
}

run();
