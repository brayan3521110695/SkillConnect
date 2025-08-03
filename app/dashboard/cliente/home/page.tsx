'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  FaSignOutAlt, FaHome, FaGlobe, FaCog, FaEnvelope, FaBell,
  FaBars, FaTimes, FaUser
} from 'react-icons/fa';
import Link from 'next/link';

export default function ClienteHome() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: 'Cargando...', email: '' });
  const [trabajadores, setTrabajadores] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await axios.get('/api/auth/userinfo');
        setUsuario(res.data.usuario);
      } catch (err) {
        console.error('Error al obtener usuario', err);
      }
    };
    obtenerUsuario();
  }, []);

  useEffect(() => {
  const fetchTrabajadores = async () => {
    const res = await fetch('/api/trabajadores');
    const data = await res.json();
    setTrabajadores(data); // aquí los trabajadores reales
  };

  fetchTrabajadores();
}, []);

 const trabajadoresFiltrados = trabajadores.filter((t: any) =>
  t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
  (t.especialidad || '').toLowerCase().includes(filtro.toLowerCase())
);

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
                <p className="font-semibold text-gray-900">{usuario.nombre}</p>
                <p className="text-gray-500 text-xs">{usuario.email}</p>
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
        <p className="text-sm text-gray-500 mb-4">¡Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}!</p>

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
            <div key={trab._id} className="border rounded-md p-4 shadow-sm bg-white">
              <img src={trab.avatar || '/images/user.jpg'} alt={trab.nombre} className="w-16 h-16 rounded-full mb-2" />
              <h2 className="text-lg font-semibold">{trab.nombre}</h2>
<p className="text-sm text-gray-600">{trab.especialidad || 'Sin especialidad'}</p>
              <button
                onClick={async () => {
                  try {
                    const clienteRes = await axios.get('/api/auth/userinfo');
                    const clienteId = clienteRes.data.usuario._id;

                    const res = await axios.post('/api/conversaciones', {
                      usuario1: clienteId,
                      usuario2: trab._id,
                    });

                    const conversacion = res.data;
                    router.push(`/dashboard/cliente/chats/conversacion/${conversacion._id}`); // ✅ Esta es la ruta correcta
                  } catch (error) {
                    console.error('Error al crear conversación', error);
                  }
                }}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
