'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  FaSignOutAlt, FaHome, FaGlobe, FaCog, FaEnvelope, FaBell,
  FaBars, FaTimes, FaUser
} from 'react-icons/fa';
import Link from 'next/link';

export default function ClienteHome() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const { data: session, status } = useSession();

  const usuario = session?.user;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      const res = await fetch('/api/trabajadores');
      const data = await res.json();
      setTrabajadores(data);
    };

    fetchTrabajadores();
  }, []);

  const trabajadoresFiltrados = trabajadores.filter((t: any) =>
    t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (t.profesion || '').toLowerCase().includes(filtro.toLowerCase())
  );

  if (status === 'loading') return <p className="p-5 text-gray-500">Cargando sesión...</p>;
  if (status === 'unauthenticated') return null;

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      {/* Menú lateral */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-700">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <aside className={`bg-white shadow-md fixed top-0 left-0 h-screen w-64 z-40 transform transition-transform duration-300
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-full flex flex-col justify-between px-6 py-8">
          <div>
            <img src="/images/logo.png" alt="SkillConnect" className="h-10 mb-8" />
            <nav className="flex flex-col gap-4 text-sm text-gray-700">
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaHome /> Inicio</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaGlobe /> Explora</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaCog /> Ajustes</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaEnvelope /> Mensajes</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaBell /> Notificaciones</a>
              <button
                onClick={async () => {
                  try {
                    await axios.post('/api/auth/logout');
                  } catch (err) {
                    console.error('Error al cerrar sesión', err);
                  } finally {
                    router.push('/login');
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-2 text-sm"
              >
                <FaSignOutAlt /> Salir
              </button>
            </nav>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <img src="/images/user.jpg" alt="Usuario" className="w-10 h-10 rounded-full object-cover" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{usuario?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 text-xs">{usuario?.email || ''}</p>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/dashboard/cliente/perfil" className="text-blue-600 text-sm font-medium hover:underline">
                <FaUser className="inline-block mr-1" /> Ver perfil
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto pt-20 lg:pt-10">
        <h1 className="text-2xl font-semibold mb-1">Inicio</h1>
        <p className="text-sm text-gray-500 mb-4">
          ¡Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}!
        </p>

        {/* Filtro de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar trabajador por nombre o profesión..."
            className="w-full border px-4 py-2 rounded-md text-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* Tarjetas de trabajadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajadoresFiltrados.map((trab: any) => (
            <div key={trab._id} className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition">
              <img
                src={trab.imagenes?.[0] || '/images/user.jpg'}
                alt={trab.nombre}
                className="w-20 h-20 rounded-full mx-auto object-cover mb-3"
              />
              <h2 className="text-xl font-semibold text-center">{trab.nombre}</h2>
              <p className="text-center text-gray-600 text-sm">{trab.profesion || 'Sin profesión'}</p>
              <p className="text-gray-500 text-xs mt-2 text-center">{trab.descripcion || 'Sin descripción.'}</p>

              <Link
                href={`/dashboard/cliente/detalle/${trab._id}`}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm text-center block"
              >
                Ver detalles
              </Link>

             <button
  onClick={async () => {
    const mensajeInicial = prompt("Escribe tu primer mensaje:");

    if (!mensajeInicial?.trim()) {
      alert("No puedes iniciar una conversación sin mensaje.");
      return;
    }

    try {
      const res = await axios.post('/api/conversaciones', {
        clienteId: usuario?.id,
        trabajadorId: trab._id,
        mensajeInicial: mensajeInicial.trim()
      });

      const conversacion = res.data;
      router.push(`/dashboard/cliente/chats/conversacion/${conversacion._id}`);
    } catch (error) {
      console.error('Error al crear conversación', error);
    }
  }}
  className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
>
  Enviar mensaje
</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
