'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarPerfil() {
  const router = useRouter();

  const [cliente, setCliente] = useState({
    nombre: 'Miguel Torres',
    correo: 'miguel@example.com',
    foto: '/images/user.jpg',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Datos enviados:', cliente);
      router.push('/dashboard/cliente/perfil');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Editar Perfil</h2>
          <p className="mt-2 text-sm text-gray-600">
            Actualiza tu información personal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              name="correo"
              value={cliente.correo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Foto (URL)</label>
            <input
              type="text"
              name="foto"
              value={cliente.foto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
