'use client';

import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function HistorialTrabajadorPage() {
  const router = useRouter();

  const historial = [
    {
      id: 1,
      cliente: 'Juan Pérez',
      servicio: 'Instalación eléctrica',
      fecha: '15 de junio de 2025',
      pago: '$800 MXN',
    },
    {
      id: 2,
      cliente: 'María López',
      servicio: 'Mantenimiento de focos',
      fecha: '10 de junio de 2025',
      pago: '$400 MXN',
    },
    {
      id: 3,
      cliente: 'Carlos Sánchez',
      servicio: 'Revisión de cortocircuito',
      fecha: '7 de junio de 2025',
      pago: '$600 MXN',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Historial de servicios</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 text-sm hover:underline flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Volver
          </button>
        </div>

        {/* Lista del historial */}
        <ul className="space-y-4">
          {historial.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-800">{item.servicio}</p>
                <p>Cliente: {item.cliente}</p>
                <p>Fecha: {item.fecha}</p>
                <p className="text-green-700 font-semibold mt-1">Pagado: {item.pago}</p>
              </div>
              <div className="flex items-center text-green-600 font-medium">
                <FaCheckCircle className="mr-2" />
                Completado
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
