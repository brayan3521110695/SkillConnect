import Cliente from '@/models/cliente';
import dbConnect from '@/lib/dbConnect';

export const crearCliente = async (data: any) => {
  await dbConnect();
  const nuevo = new Cliente(data);
  return await nuevo.save();
};

export const obtenerClientePorEmail = async (email: string) => {
  await dbConnect();
  return await Cliente.findOne({ email });
};

export const obtenerClientePorId = async (id: string) => {
  await dbConnect();
  return await Cliente.findById(id);
};
