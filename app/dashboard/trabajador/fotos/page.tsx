'use client';
import React, { useEffect, useState } from 'react';
import {
  FaHeart, FaRegHeart, FaHome, FaGlobe, FaCog,
  FaEnvelope, FaBell, FaSignOutAlt, FaImages, FaBars, FaTimes
} from 'react-icons/fa';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

const FotosTrabajador: React.FC = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await fetch('/api/auth/userinfo');
        const data = await res.json();
        setNombre(data.usuario?.nombre || '');
        setEmail(data.usuario?.email || '');
      } catch (err) {
        console.error('Error al obtener usuario', err);
        router.push('/login');
      }
    };

    const obtenerPublicaciones = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/publicaciones/mias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPublicaciones(data);
      setLikes(data.map((p: any) => ({
        id: p._id,
        liked: false,
        total: p.likes || 0,
      })));
    };

    obtenerUsuario();
    obtenerPublicaciones();
  }, [router]);

  const toggleLike = (id: string) => {
    setLikes((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, liked: !l.liked, total: l.liked ? l.total - 1 : l.total + 1 }
          : l
      )
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Botón hamburguesa */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-700">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar izquierdo */}
      <aside className={`bg-white shadow-md px-6 py-8 flex-col items-center fixed h-full transition-transform duration-300 z-40
        ${menuAbierto ? 'flex w-64' : 'hidden'} lg:flex lg:w-64`}>
        <img src="/images/logo_corto.png" alt="SkillConnect" className="h-10 mb-8" />
        <img src="/images/foto_perfil.png" alt="Perfil" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-2 object-cover" />
        <h2 className="text-xl font-bold text-center">{nombre || 'Nombre del trabajador'}</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">{email || 'correo@ejemplo.com'}</p>
        <div className="flex gap-4 text-center mb-6">
          <div><p className="font-bold">{publicaciones.length}</p><span className="text-sm text-gray-600">Publicaciones</span></div>
          <div><p className="font-bold">4.8</p><span className="text-sm text-gray-600">Calificación</span></div>
          <div><p className="font-bold">30</p><span className="text-sm text-gray-600">Reseñas</span></div>
        </div>
        <nav className="flex flex-col gap-6 text-sm text-gray-800 w-full">
          <a href="/dashboard/trabajador" className="flex items-center gap-2 hover:text-blue-600"><FaHome /> Inicio</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaGlobe /> Explora</a>
          <a href="/dashboard/trabajador/fotos" className="flex items-center gap-2 hover:text-blue-600"><FaImages /> Fotos</a>
          <a href="/dashboard/trabajador/chats" className="flex items-center gap-2 hover:text-blue-600"><FaEnvelope /> Mensajes</a>
          <a href="/dashboard/trabajador/notificaciones" className="flex items-center gap-2 hover:text-blue-600"><FaBell /> Notificaciones</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaCog /> Ajustes</a>
          <a href="#" className="flex items-center gap-2 text-red-500"><FaSignOutAlt /> Salir</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="w-full mt-16 px-4 sm:px-6 py-6 lg:ml-64">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-1/2 relative">
            <span className="absolute left-4 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar"
              className="w-full pl-12 pr-4 py-2 border rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={() => router.push('/dashboard/trabajador/publicaciones/crear')}
            className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg"
          >
            + Nueva publicación
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Tus Fotos</h2>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {publicaciones.map((pub) => {
            const likeState = likes.find((l) => l.id === pub._id);

            return (
              <div key={pub._id} className="break-inside-avoid rounded-lg overflow-hidden shadow-sm bg-white mb-4">
                <img src={pub.imagen} alt="Publicación" className="w-full object-cover rounded-t-md" />
                <div className="flex justify-between items-center text-sm text-gray-600 px-3 py-2">
                  <button
                    onClick={() => toggleLike(pub._id)}
                    className={`flex items-center gap-1 text-sm transition-transform hover:scale-105 ${likeState?.liked ? 'text-red-500' : 'text-gray-500'}`}
                    title="Guardar en favoritos"
                  >
                    {likeState?.liked ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
                    <span>{likeState?.total}</span>
                  </button>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineChatBubbleOvalLeft className="text-base w-5 h-5" />
                    {pub.comments || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FotosTrabajador;
