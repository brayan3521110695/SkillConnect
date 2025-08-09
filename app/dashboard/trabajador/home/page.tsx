'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  FaStar, FaSignOutAlt, FaEdit, FaHistory,
  FaTasks, FaBriefcase, FaCheckCircle, FaUpload
} from 'react-icons/fa';

type Usuario = { nombre: string; email: string; foto: string };

export default function DashboardTrabajador() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [usuario, setUsuario] = useState<Usuario>({
    nombre: 'Cargando…',
    email: '',
    foto: '/images/user.jpg',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  // --- helpers ---
  const cargarUsuario = async () => {
    // Tolera {usuario:{...}} o plano y evita cache con ?t=
    const { data } = await axios.get(`/api/auth/userinfo?t=${Date.now()}`, { withCredentials: true });
    const u = data?.usuario ?? data;
    if (!u) throw new Error('No hay sesión');
    setUsuario({
      nombre: u.nombre ?? 'Trabajador',
      email:  u.email  ?? '',
      foto:   u.foto   ?? '/images/user.jpg',
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await cargarUsuario();
      } catch (e) {
        console.error('No se pudo cargar userinfo', e);
        router.push('/login');
      } finally {
        setCargando(false);
      }
    })();
  }, [router]);

  const onChangeFoto: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // preview inmediato
    const anterior = usuario.foto;
    setUsuario((u) => ({ ...u, foto: URL.createObjectURL(f) }));

    try {
      setSubiendo(true);

      // Enviar como FormData con la CLAVE CORRECTA 'foto' y método POST
      const fd = new FormData();
      fd.append('foto', f);

      const res = await fetch('/api/trabajadores/foto', {
        method: 'POST',
        body: fd, // sin headers manuales
      });

      // intenta leer json (si no hay body no truena)
      let payload: any = {};
      try { payload = await res.json(); } catch {}

      if (!res.ok) {
        alert('No se pudo actualizar la foto de perfil.' + (payload?.error ? `\n${payload.error}` : ''));
        setUsuario((u) => ({ ...u, foto: anterior })); // revertir preview
        return;
      }

      // refresca datos para tomar la URL final guardada en BD
      await cargarUsuario();
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar la foto de perfil.');
      setUsuario((u) => ({ ...u, foto: anterior }));
    } finally {
      setSubiendo(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (cargando) {
    return <main className="min-h-screen grid place-items-center text-gray-500">Cargando…</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={usuario.foto}
                alt="Foto trabajador"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow"
              />
              {/* Botón subir foto */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                title="Cambiar foto"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                disabled={subiendo}
              >
                <FaUpload />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onChangeFoto}
              />
              {subiendo && (
                <span className="absolute inset-0 rounded-full bg-black/30 text-white text-xs flex items-center justify-center">
                  Subiendo…
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{usuario.nombre}</h2>
              <p className="text-sm text-gray-600">{usuario.email}</p>
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
            onClick={async () => {
              try { await axios.post('/api/auth/logout'); }
              finally { router.push('/login'); }
            }}
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
