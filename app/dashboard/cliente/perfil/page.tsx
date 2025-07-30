'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import {
  FaSignOutAlt, FaHome, FaGlobe, FaCog, FaCommentDots, FaBell,
  FaCheckCircle, FaClock, FaBars, FaTimes
} from 'react-icons/fa';

export default function PerfilCliente() {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: 'Cargando...',
    email: '',
    foto: '/images/user.jpg',
    serviciosContratados: 0,
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await axios.get('/api/auth/userinfo');
        const usuario = res.data.usuario;
        setCliente((prev) => ({
          ...prev,
          nombre: usuario.nombre,
          email: usuario.email,
          serviciosContratados: 12,
        }));
      } catch (err) {
        console.error('Error al obtener datos del cliente', err);
      }
    };
    obtenerDatos();
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);

  const serviciosRecientes = [
    {
      titulo: 'Limpieza de sala',
      fecha: '2024-07-01',
      estado: 'Completado',
      imagen: '/images/limpieza.jpg',
    },
    {
      titulo: 'Instalación de mini split',
      fecha: '2024-06-28',
      estado: 'En proceso',
      imagen: '/images/split2.webp',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Botón hamburguesa */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-700">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white shadow-md px-6 py-8 fixed h-screen z-40 transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex lg:flex-col lg:w-64`}>
        <img src="/images/logo.png" alt="SkillConnect" className="h-10 mb-8" />
        <img src={cliente.foto} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3 mx-auto" />
        <h2 className="text-lg font-bold text-center">{cliente.nombre}</h2>
        <p className="text-sm text-gray-500 text-center">{cliente.email}</p>

        <nav className="flex flex-col gap-4 text-sm text-gray-700 w-full items-start my-6">
          <Link href="/cliente/home" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600">
            <FaHome /><span>Inicio</span>
          </Link>
          <Link href="/cliente/explora" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600">
            <FaGlobe /><span>Explora</span>
          </Link>
          <Link href="/cliente/ajustes" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600">
            <FaCog /><span>Ajustes</span>
          </Link>
          <Link href="/cliente/chats" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600">
            <FaCommentDots /><span>Mensajes</span>
          </Link>
          <Link href="/cliente/notificaciones" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600">
            <FaBell /><span>Notificaciones</span>
          </Link>
        </nav>

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
          className="flex items-center gap-2 text-red-600 hover:underline text-sm w-full justify-start mt-4"
        >
          <FaSignOutAlt />
          <span>Salir</span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50 mt-16 px-4 lg:ml-64 scrollbar-hide">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-6">
            👋 ¡Hola, {cliente.nombre !== 'Cargando...' ? cliente.nombre.split(' ')[0] : 'cliente'}!
          </h1>

          <section className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Resumen de cuenta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="border rounded-xl p-4">
                <p className="text-gray-500 mb-2">Servicios contratados</p>
                <div className="text-3xl font-bold text-blue-600">{cliente.serviciosContratados}</div>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-gray-500 mb-2">Satisfacción</p>
                <div className="text-3xl font-bold text-green-600">100%</div>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-gray-500 mb-2">Reseñas escritas</p>
                <div className="text-3xl font-bold text-yellow-500">30</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/cliente/perfil/editar')}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Editar información
            </button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">🕓 Últimos servicios contratados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviciosRecientes.map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
                  <img src={s.imagen} alt={s.titulo} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold text-lg">{s.titulo}</h3>
                    <p className="text-sm text-gray-500">Fecha: {s.fecha}</p>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      {s.estado === 'Completado' ? (
                        <>
                          <FaCheckCircle className="text-green-600" />
                          <span className="text-green-600">{s.estado}</span>
                        </>
                      ) : (
                        <>
                          <FaClock className="text-yellow-500" />
                          <span className="text-yellow-600">{s.estado}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
