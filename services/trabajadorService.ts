import Trabajador from '@/models/trabajador';
import dbConnect from '@/lib/dbConnect';

export const crearTrabajador = async (data: any) => {
  await dbConnect();
  const nuevo = new Trabajador(data);
  return await nuevo.save();
};

export const obtenerTrabajadorPorEmail = async (email: string) => {
  await dbConnect();
  return await Trabajador.findOne({ email });
};

export const obtenerTodosTrabajadores = async () => {
  await dbConnect();
  return await Trabajador.find();
};

export const actualizarImagenPerfil = async (id: string, url: string) => {
  await dbConnect();
  return await Trabajador.findByIdAndUpdate(id, { imagen: url }, { new: true });
};
