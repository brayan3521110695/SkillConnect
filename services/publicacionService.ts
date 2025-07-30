import Publicacion from '@/models/publicacion';
import dbConnect from '@/lib/dbConnect';

export const crearPublicacion = async (data: any) => {
  try {
    await dbConnect();
    const nueva = new Publicacion(data);
    return await nueva.save(); // Aquí fallaba silenciosamente
  } catch (error: any) {
    console.error('❌ Error al guardar publicación:', error.message);
    throw new Error(error.message);
  }
};


export const obtenerPublicaciones = async () => {
  await dbConnect();
  return await Publicacion.find().populate('trabajadorId');
};

export const obtenerPublicacionesPorTrabajador = async (trabajadorId: string) => {
  await dbConnect();
  return await Publicacion.find({ trabajadorId }).sort({ createdAt: -1 });
};
