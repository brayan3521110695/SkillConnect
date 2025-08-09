'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from "next-auth/react";
import {
  FaHeart,
  FaRegHeart,
  FaHome,
  FaGlobe,
  FaCog,
  FaEnvelope,
  FaBell,
  FaSignOutAlt,
  FaBookmark,
  FaRegBookmark,
  FaRegComment,
  FaImages,
  FaBars,
  FaTimes,
  FaUpload, // 👈 para el botón de subir
} from 'react-icons/fa';

function MenuOpciones({ id, onEliminar }: { id: string; onEliminar: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const eliminar = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/publicaciones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setConfirmDelete(false);
      setOpen(false);
      onEliminar();
    } else {
      alert('Error al eliminar publicación');
    }
  };

  const handleEditar = () => {
    router.push(`/dashboard/trabajador/publicaciones/editar/${id}`);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 hover:text-black px-2 py-1 rounded-full text-xl"
        title="Opciones"
      >
        ⋯
      </button>

      {open && !confirmDelete && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
          <button
            onClick={handleEditar}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Editar
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Eliminar
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-red-300 rounded-md shadow-lg p-4 text-sm">
          <p className="text-gray-800 mb-3">¿Estás seguro de eliminar esta publicación?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setConfirmDelete(false);
                setOpen(false);
              }}
              className="px-3 py-1 text-gray-700 hover:text-black"
            >
              Cancelar
            </button>
            <button
              onClick={eliminar}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrabajadorHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const usuario = session?.user as any;

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState('/images/foto_perfil.png'); // 👈 avatar mostrado
  const [subiendo, setSubiendo] = useState(false);             // 👈 estado de subida

  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [guardados, setGuardados] = useState<string[]>([]);
  const [mostrarMensajes, setMostrarMensajes] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);         // 👈 input oculto

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const res = await axios.get('/api/auth/userinfo');
        const u = res.data.usuario || {};
        setNombre(u.nombre || '');
        setEmail(u.email || '');
        // lee misma propiedad que usas en el editor: image (fallback a foto)
        setFoto(u.image || u.foto || '/images/foto_perfil.png');
      } catch (error) {
        console.error('Error al obtener datos del trabajador:', error);
        router.push('/login');
      }
    };
    obtenerDatosUsuario();
  }, [router]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/publicaciones/mias', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setPublicaciones(data);
        setLikes(
          data.map((pub: any) => ({
            id: pub._id,
            liked: false,
            total: pub.likes || 0,
          }))
        );
      } else {
        console.error('❌ Error en publicaciones:', data?.error ?? 'Respuesta inesperada:', data);
        setPublicaciones([]);
      }
    };

    fetchPublicaciones();
  }, []);

  const toggleLike = (id: string) => {
    setLikes((prev) =>
      prev.map((l: any) =>
        l.id === id
          ? { ...l, liked: !l.liked, total: l.liked ? l.total - 1 : l.total + 1 }
          : l
      )
    );
  };

  const toggleGuardar = (id: string) => {
    setGuardados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  // ======== Lógica de subir imagen (idéntica en UX a tu editor) ========
  const setPreviewFromFile = (file: File) => {
    const url = URL.createObjectURL(file); // preview local
    setFoto(url);
  };

  const abrirSelector = () => fileInputRef.current?.click();

  // ===== SUBIR FOTO (usa FormData hacia /api/trabajadores/foto) =====
const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;

  // 1) Preview local inmediato
  setFoto(URL.createObjectURL(file));

  try {
    setSubiendo(true);

    // 2) Enviar el archivo real
    const fd = new FormData();
    fd.append('foto', file); // <-- el route.ts acepta "foto" o "file"

    const token = localStorage.getItem('token') || '';
    const resp = await fetch('/api/trabajadores/foto', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json?.error || 'Error al subir');

    // 3) Usar la URL final devuelta por el backend
    if (json?.url) setFoto(json.url);

    // (opcional) refrescar tus datos de usuario
    // const { data } = await axios.get('/api/auth/userinfo');
    // setFoto(data.usuario?.image || data.usuario?.foto || json.url);
  } catch (err) {
    console.error(err);
    alert('No se pudo actualizar la foto de perfil.');
  } finally {
    setSubiendo(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};
// =================================================================

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Botón hamburguesa visible solo en móvil */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-700">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar izquierdo */}
      <aside className={`bg-white shadow-md px-6 py-8 flex-col items-center fixed h-screen transition-transform duration-300 z-40
        ${menuAbierto ? 'flex w-64' : 'hidden'} lg:flex lg:w-70`}>

        <img src="/images/logo_corto.png" alt="SkillConnect" className="h-10 mb-8" />

        {/* Avatar con botón superpuesto (igual estilo) */}
        <div className="relative mb-2">
          <img
            src={foto}
            alt="Perfil"
            className="w-30 h-30 rounded-full object-cover ring-4 ring-white shadow-md"
          />
          <button
            type="button"
            onClick={abrirSelector}
            className="absolute bottom-0 -right-1 bg-white text-slate-700 border rounded-full p-2 shadow hover:shadow-md active:scale-95 transition"
            title="Subir imagen"
            disabled={subiendo}
          >
            <FaUpload />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChangeFile}
          />
          {subiendo && (
            <span className="absolute inset-0 rounded-full bg-black/30 text-white text-xs flex items-center justify-center">
              Subiendo…
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-center">{usuario?.nombre || 'Trabajador'}</h2>
        <p className="text-sm text-gray-600 text-center">{usuario?.email || ''}</p>

        <div className="flex gap-4 text-center mb-6">
          <div><p className="font-bold text-x">{publicaciones.length}</p><span className="text-sm text-gray-600">Publicaciones</span></div>
          <div><p className="font-bold text-x">4.8</p><span className="text-sm text-gray-600">Calificación</span></div>
          <div><p className="font-bold text-x">30</p><span className="text-sm text-gray-600">Reseñas</span></div>
        </div>

        <nav className="flex flex-col gap-7 text-base text-gray-800 w-full px-2">
          <a href="/dashboard/trabajador" className="flex items-center gap-2 hover:text-blue-600 transition"><FaHome /> Inicio</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition"><FaGlobe /> Explora</a>
          <a href="/dashboard/trabajador/fotos" className="flex items-center gap-2 hover:text-blue-600 transition"><FaImages /> Fotos</a>
          <a href="/dashboard/trabajador/chats" className="flex items-center gap-2 hover:text-blue-600 transition"><FaEnvelope /> Mensajes</a>
          <a href="/dashboard/trabajador/notificaciones" className="flex items-center gap-2 hover:text-blue-600 transition"><FaBell /> Notificaciones</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition"><FaCog /> Ajustes</a>
          <a href="#" className="flex items-center gap-2 text-red-500"><FaSignOutAlt /> Salir</a>
        </nav>
      </aside>

      {/* Panel derecho - Sugerencias */}
      <aside className="w-70 bg-white px-4 py-6 fixed right-0 top-0 h-screen overflow-y-auto hidden lg:block">
        <h3 className="text-m font-semibold text-gray-700 px-2">Sugerencias para ti</h3>
        <ul className="mt-3 space-y-4 px-2">
          {["Lucia_12", "BrayanC", "J. Valerio"].map((user, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={`/images/editables/user${i + 1}.jpg`} className="w-9 h-9 rounded-full object-cover" alt={user} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user}</p>
                  <p className="text-xs text-gray-500">Sugerencia para ti</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm font-medium hover:underline">Seguir</button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide mt-16 px-4 lg:ml-64 lg:mr-72">
        <div className="p-8">
          {/* Buscador */}
          <div className="relative mb-6 w-full sm:w-3/4 md:w-1/2 mx-auto">
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

          <section className="transition-all duration-300">
            {/* Título y botón */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tus Publicaciones</h2>
              <Link href="/dashboard/trabajador/publicaciones/crear">
                <button className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition">
                  + Nueva publicación
                </button>
              </Link>
            </div>

            {publicaciones.map((pub: any) => {
              const likeState = likes.find((l: any) => l.id === pub._id);
              return (
                <div
                  key={pub._id}
                  className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-2xl mx-auto"
                >
                  {/* Header del usuario */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={foto}  // 👈 usa la foto actual
                        className="w-10 h-10 rounded-full object-cover"
                        alt="usuario"
                      />
                      <span className="font-semibold text-sm text-gray-800">Tú</span>
                    </div>
                    <MenuOpciones
                      id={pub._id}
                      onEliminar={() => {
                        setMensaje('✅ Publicación eliminada');
                        setPublicaciones((prev) => prev.filter((p) => p._id !== pub._id));
                        setTimeout(() => setMensaje(''), 3000);
                      }}
                    />
                  </div>

                  {/* Imagen principal */}
                  <img src={pub.imagen} alt="Publicación" className="w-full object-cover" />

                  {/* Título y descripción */}
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{pub.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3">{pub.descripcion}</p>

                  {/* Datos clave */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                    <p><strong>Precio:</strong> ${pub.precio}</p>
                    <p><strong>Categoría:</strong> {pub.categoria}</p>
                    <p><strong>Disponible:</strong> {pub.disponibilidad}</p>
                    <p><strong>Fecha:</strong> {pub.fecha}</p>
                  </div>

                  {/* Interacciones */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <button
                      onClick={() => toggleLike(pub._id)}
                      className={`flex items-center gap-1 ${likeState?.liked ? 'text-red-500' : 'text-gray-800'}`}
                    >
                      {likeState?.liked ? <FaHeart /> : <FaRegHeart />}
                      <span>{likeState?.total}</span>
                    </button>

                    <span className="flex items-center gap-1 text-gray-800">
                      <FaRegComment /> {pub.comments || 0}
                    </span>

                    <button onClick={() => toggleGuardar(pub._id)}>
                      {guardados.includes(pub._id) ? (
                        <FaBookmark className="text-yellow-400" />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      {/* Botón flotante para mensajes */}
      {!mostrarMensajes && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setMostrarMensajes(true)}
            className="flex items-center bg-gray-900 text-white px-5 py-2 rounded-full shadow-lg hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-6-6H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2h-1l-6 6z" />
            </svg>
            Mensajes
          </button>
        </div>
      )}

      {/* Panel de mensajes */}
      {mostrarMensajes && (
        <div className="fixed bottom-6 right-6 w-90 max-w-full bg-[#1c1c1e] text-white rounded-2xl shadow-2xl border border-gray-700 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#1c1c1e]">
            <h2 className="text-lg font-semibold">Mensajes</h2>
            <div className="flex items-center gap-3">
              <button title="Expandir" className="hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6m-6 0L21 3M9 21H3v-6m6 0L3 21" />
                </svg>
              </button>
              <button onClick={() => setMostrarMensajes(false)} className="text-xl hover:text-gray-300">&times;</button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto bg-[#1c1c1e]">
            <div className="hover:bg-[#2c2c2e] px-4 py-3 cursor-pointer flex gap-4 items-center">
              <img src="/images/editables/chat.jpg" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-sm text-white">Lazaro.J3</p>
                <p className="text-xs text-gray-400 truncate">Tú: Nada de andar en las chelas · 1 sem</p>
              </div>
            </div>
            <div className="hover:bg-[#2c2c2e] px-4 py-3 cursor-pointer flex gap-4 items-center">
              <img src="/images/editables/chat2.jpg" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold text-sm text-white">EFRABY</p>
                <p className="text-xs text-gray-400 truncate">EFRABY envió un archivo adjunto · 5 sem</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
