'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Publicacion {
  _id: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  createdAt: string;
}

export default function PublicacionesPage() {
  const router = useRouter();
  const { status } = useSession(); // ← usamos la sesión de NextAuth
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  // Si no hay sesión, redirige a login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPublicaciones();
    }
  }, [status]);

  const fetchPublicaciones = async () => {
    try {
      setCargando(true);
      setError('');

      const res = await fetch('/api/publicaciones/mias', {
        cache: 'no-store', // para no cachear en cliente
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cargar publicaciones');
        setPublicaciones([]);
        return;
      }

      setPublicaciones(data);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
      setPublicaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    const confirmado = window.confirm('¿Estás seguro de eliminar esta publicación?');
    if (!confirmado) return;

    try {
      setEliminandoId(id);
      const res = await fetch(`/api/publicaciones/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Error al eliminar publicación');
        return;
      }

      // Optimista: quita del estado sin re-fetch completo
      setPublicaciones((prev) => prev.filter((p) => p._id !== id));
      setMensaje('✅ Publicación eliminada');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    } finally {
      setEliminandoId(null);
    }
  };

  if (status === 'loading') {
    return <main className="min-h-screen grid place-items-center">Cargando…</main>;
  }
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h1>
          <button
            onClick={fetchPublicaciones}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50"
          >
            Recargar
          </button>
        </div>

        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {cargando ? (
          <p className="text-gray-600">Cargando publicaciones…</p>
        ) : publicaciones.length === 0 ? (
          <p className="text-gray-600 text-center">No tienes publicaciones aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicaciones.map((publi) => (
              <div
                key={publi._id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col"
              >
                <img
                  src={publi.imagen}
                  alt="imagen publicación"
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-indigo-500 font-medium">{publi.categoria}</p>
                    <p className="text-gray-800 mt-1">{publi.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Publicado el {new Date(publi.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/trabajador/publicaciones/editar/${publi._id}`)
                      }
                      className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(publi._id)}
                      disabled={eliminandoId === publi._id}
                      className="text-sm px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                    >
                      {eliminandoId === publi._id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
