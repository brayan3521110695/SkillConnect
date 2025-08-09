'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import {
  FaArrowLeft, FaSave, FaUser, FaAt, FaImage, FaUpload
} from 'react-icons/fa';

export default function EditarPerfil() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    foto: '/images/user.jpg',
  });

  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos actuales
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get('/api/cliente/perfil', { withCredentials: true });
        const u = res.data?.usuario;
        if (!u) return router.push('/login');
        setCliente({
          nombre: u.nombre ?? '',
          email: u.email ?? '',
          foto: u.image ?? '/images/user.jpg',
        });
      } catch (e: any) {
        if (e?.response?.status === 401) router.push('/login');
        console.error('No se pudo cargar el perfil', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const setPreviewFromFile = (file: File) => {
    const url = URL.createObjectURL(file); // preview local
    setCliente((p) => ({ ...p, foto: url }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) setPreviewFromFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await axios.put(
        '/api/cliente/perfil',
        { nombre: cliente.nombre, email: cliente.email, image: cliente.foto },
        { withCredentials: true }
      );
      router.replace('/dashboard/cliente/perfil?updated=' + Date.now());
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert('No se pudo guardar. Revisa la consola.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Top bar centrado con 3 columnas */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 items-center h-14">
            <div className="flex">
              <Link
                href="/dashboard/cliente/perfil"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <FaArrowLeft /> Volver
              </Link>
            </div>
            <div className="flex justify-center">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Editar Perfil</h1>
            </div>
            <div className="flex justify-end">
              {/* espacio para acciones futuras */}
            </div>
          </div>
        </div>
      </div>

      {/* Hero sutil */}
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-indigo-600 to-fuchsia-600">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 text-white">
          <p className="opacity-90">Actualiza tu información personal</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tu cuenta, tu estilo</h2>
        </div>
      </div>

      {/* Card principal */}
      <div className="-mt-14 pb-28">
        <div className="max-w-4xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl shadow-xl bg-white/80 backdrop-blur border border-white/60 p-6 sm:p-10"
          >
            {/* Header con avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
              <div className="relative">
                <img
                  src={cliente.foto}
                  alt="Foto de perfil"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 -right-1 sm:-right-2 bg-white text-slate-700 border rounded-full p-2 shadow hover:shadow-md active:scale-95 transition"
                  title="Subir imagen"
                >
                  <FaUpload />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && f.type.startsWith('image/')) setPreviewFromFile(f);
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {cliente.nombre || (cargando ? 'Cargando…' : 'Sin nombre')}
                </h3>
                <p className="text-slate-500">{cliente.email || (cargando ? 'Cargando…' : '')}</p>
                <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Perfil</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">Cuenta</span>
                </div>
              </div>
            </div>

            {/* Zona drag & drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`mb-8 rounded-xl border-dashed border-2 p-5 text-center transition
                ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50/50'}`}
            >
              <p className="text-sm text-slate-600">
                Arrastra una imagen aquí o <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-700 underline underline-offset-2"
                >selecciónala</button>.
              </p>
              <p className="text-xs text-slate-500 mt-1">JPG/PNG recomendados. Peso máx. ~5MB</p>
            </div>

            {/* Inputs */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    placeholder={cargando ? 'Cargando…' : 'Tu nombre'}
                    disabled={cargando}
                    className="w-full pl-10 pr-3 h-11 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">Así verán tu nombre los demás usuarios.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
                <div className="relative">
                  <FaAt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="email"
                    name="email"
                    value={cliente.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    disabled={cargando}
                    className="w-full pl-10 pr-3 h-11 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Foto (URL)</label>
                <div className="relative">
                  <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    name="foto"
                    value={cliente.foto}
                    onChange={handleChange}
                    placeholder="/images/user.jpg o https://…"
                    disabled={cargando}
                    className="w-full pl-10 pr-3 h-11 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Puedes pegar un enlace o usar el botón/drag&drop para previsualizar una imagen local.
                </p>
              </div>
            </div>

            {/* Barra de acciones sticky */}
            <div className="sticky bottom-4 mt-10">
              <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border p-3 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  href="/dashboard/cliente/perfil"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={cargando || enviando}
                  className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:scale-[.99] disabled:opacity-60 transition gap-2"
                >
                  <FaSave /> {enviando ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
