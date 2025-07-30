'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  FaStar, FaSignOutAlt, FaEdit, FaHistory,
  FaTasks, FaBriefcase, FaCheckCircle
} from 'react-icons/fa';

export default function DashboardTrabajador() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const res = await axios.get('/api/auth/userinfo');
        setNombre(res.data.nombre);
        setEmail(res.data.email);
      } catch (error) {
        console.error('Error al obtener datos del trabajador:', error);
        router.push('/login');
      }
    };
    obtenerDatosUsuario();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/user.jpg"
              alt="Foto trabajador"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{nombre || 'Nombre del trabajador'}</h2>
              <p className="text-sm text-gray-600">{email || 'correo@ejemplo.com'}</p>
              <div className="flex items-center text-yellow-500 text-sm mt-1">
                <FaStar />
                <span className="ml-1">4.9 (45 reseñas)</span>
              </div>
            </div>
          </div>
          <button
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            onClick={() => router.push('/trabajador/editar')}
          >
            <FaEdit className="mr-2" />
            Editar perfil
          </button>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center text-blue-600">
              <FaCheckCircle className="mr-2" /> Contrataciones activas
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🔧 Juan Pérez - Instalación de focos</li>
              <li>💡 María López - Cotización eléctrica</li>
            </ul>
          </div>

          <div className="bg-green-50 border p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center text-green-600">
              <FaHistory className="mr-2" /> Historial
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🔌 Pedro Sánchez - Cableado interior</li>
              <li>🛠️ Rosa Martínez - Reparación de contactos</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center text-yellow-600">
              <FaBriefcase className="mr-2" /> Servicios ofrecidos
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Instalación de focos</li>
              <li>✅ Cableado interior</li>
              <li>✅ Reparaciones eléctricas</li>
            </ul>
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-bold text-lg mb-2">Disponibilidad</h3>
          <p>Lunes a Viernes - 9:00 AM a 6:00 PM</p>
          <p>📍 Zona: Tehuacán</p>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/trabajador/historial')}
            className="flex items-center justify-center gap-2 p-4 bg-white border rounded hover:bg-gray-50 text-sm"
          >
            <FaHistory className="text-blue-600" />
            Historial
          </button>
          <button
            onClick={() => router.push('/trabajador/activos')}
            className="flex items-center justify-center gap-2 p-4 bg-white border rounded hover:bg-gray-50 text-sm"
          >
            <FaTasks className="text-yellow-600" />
            Activos
          </button>
          <button
            onClick={() => router.push('/trabajador/servicios')}
            className="flex items-center justify-center gap-2 p-4 bg-white border rounded hover:bg-gray-50 text-sm"
          >
            <FaBriefcase className="text-green-600" />
            Servicios
          </button>
          <button
            onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-2 p-4 bg-white border rounded hover:bg-red-100 text-red-600 text-sm"
          >
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
