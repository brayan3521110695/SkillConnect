'use client';

import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

export default function TrabajadorActivosPage() {
  const router = useRouter();

  const serviciosActivos = [
    {
      cliente: 'Ana Torres',
      servicio: 'Instalación eléctrica',
      fecha: '30/06/2025',
      estado: 'En progreso',
    },
    {
      cliente: 'Luis García',
      servicio: 'Revisión de cortocircuito',
      fecha: '29/06/2025',
      estado: 'Pendiente',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Contrataciones activas</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <FaArrowLeft className="mr-1" />
            Volver
          </button>
        </div>

        {serviciosActivos.length === 0 ? (
          <p className="text-gray-500 text-sm">No tienes contrataciones activas por el momento.</p>
        ) : (
          <ul className="space-y-4">
            {serviciosActivos.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.cliente}</p>
                  <p className="text-sm text-gray-600">{item.servicio}</p>
                  <p className="text-xs text-gray-400">Fecha: {item.fecha}</p>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  {item.estado === 'En progreso' ? (
                    <>
                      <FaCheckCircle className="text-green-500 mr-1" />
                      En progreso
                    </>
                  ) : item.estado === 'Pendiente' ? (
                    <>
                      <FaClock className="text-yellow-500 mr-1" />
                      Pendiente
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-500 mr-1" />
                      Cancelado
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
