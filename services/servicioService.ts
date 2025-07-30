import Servicio from '@/models/servicio';
import dbConnect from '@/lib/dbConnect';

export const crearServicio = async (data: any) => {
  await dbConnect();
  const nuevo = new Servicio(data);
  return await nuevo.save();
};

export const obtenerServiciosPorTrabajador = async (trabajadorId: string) => {
  await dbConnect();
  return await Servicio.find({ trabajadorId });
};
