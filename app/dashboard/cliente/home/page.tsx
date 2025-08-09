'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FaSignOutAlt, FaHome, FaGlobe, FaCog, FaEnvelope, FaBell,
  FaBars, FaTimes, FaUser,
  FaFileAlt
} from 'react-icons/fa';

export default function ClienteHome() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');

  // Si no hay sesión -> login
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Refrescar la sesión si el perfil cambió en BD (foto, nombre, email)
  useEffect(() => {
    const syncSessionWithAPI = async () => {
      if (status !== 'authenticated') return;

      try {
        const res = await axios.get('/api/cliente/perfil', { withCredentials: true });
        const u = res.data?.usuario;
        if (!u) return;

        const fotoApi   = u.image ?? u.foto ?? '';
        const nombreApi = u.nombre ?? '';
        const emailApi  = u.email ?? '';

        const fotoChanged   = !!fotoApi   && fotoApi   !== (session?.user as any)?.foto;
        const nombreChanged = !!nombreApi && nombreApi !== (session?.user as any)?.nombre;
        const emailChanged  = !!emailApi  && emailApi  !== (session?.user as any)?.email;

        if (fotoChanged || nombreChanged || emailChanged) {
          await update({ foto: fotoApi, nombre: nombreApi, email: emailApi });
        }
      } catch (e) {
        // Silencioso: si falla, no bloquea la pantalla
        console.warn('No se pudo sincronizar sesión con API', e);
      }
    };

    syncSessionWithAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // corre al autenticarse

  // Obtener trabajadores
  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const res = await axios.get('/api/trabajadores', { withCredentials: true });
        setTrabajadores(res.data || []);
      } catch (error) {
        console.error('Error al obtener trabajadores', error);
      }
    };
    fetchTrabajadores();
  }, []);

  const trabajadoresFiltrados = trabajadores.filter((t: any) =>
    (t.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (t.profesion || '').toLowerCase().includes(filtro.toLowerCase())
  );

  const cerrarMenu = () => setMenuAbierto(false);

  if (status === 'loading') return <p className="p-5 text-gray-500">Cargando sesión...</p>;
  if (status === 'unauthenticated') return null;

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      {/* Botón hamburguesa */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-700">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md fixed top-0 left-0 h-screen w-64 z-40 transform transition-transform duration-300
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        <div className="h-full flex flex-col justify-between px-6 py-8">
          <div>
            <img src="/images/logo.png" alt="SkillConnect" className="h-10 mb-8" />
            <nav className="flex flex-col gap-4 text-sm text-gray-700">
              <Link href="/dashboard/cliente/home" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600"><FaHome /> Inicio</Link>
              <Link href="#" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600"><FaGlobe /> Explora</Link>
              <Link href="/dashboard/cliente/ajustes" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600"><FaCog /> Ajustes</Link>
              <Link href="/dashboard/cliente/chats" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600"><FaEnvelope /> Mensajes</Link>
              <Link href="/dashboard/cliente/notificaciones" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-blue-600"><FaBell /> Notificaciones</Link>
  <Link
    href="/aviso-de-privacidad"
    onClick={cerrarMenu}
    className="flex items-center gap-2 hover:text-blue-600"
  >
    <FaFileAlt /> Aviso de privacidad
  </Link>
              <button
                onClick={async () => {
                  try { await axios.post('/api/auth/logout'); }
                  catch (err) { console.error('Error al cerrar sesión', err); }
                  finally { router.push('/login'); }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-2 text-sm"
              >
                <FaSignOutAlt /> Salir
              </button>
            </nav>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <img
                src={(session?.user as any)?.foto || '/images/user.jpg'}
                alt={(session?.user as any)?.nombre || 'Usuario'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{(session?.user as any)?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 text-xs">{(session?.user as any)?.email || ''}</p>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/dashboard/cliente/perfil" onClick={cerrarMenu} className="text-blue-600 text-sm font-medium hover:underline">
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
          ¡Bienvenido{(session?.user as any)?.nombre ? `, ${(session?.user as any).nombre}` : ''}!
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
                  const mensajeInicial = prompt('Escribe tu primer mensaje:');
                  if (!mensajeInicial?.trim()) {
                    alert('No puedes iniciar una conversación sin mensaje.');
                    return;
                  }
                  try {
                    const res = await axios.post('/api/conversaciones', {
                      clienteId: (session?.user as any)?.id,
                      trabajadorId: trab._id,
                      mensajeInicial: mensajeInicial.trim(),
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
