'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Publicacion {
  _id: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  createdAt: string;
}

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/publicaciones/mias', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cargar publicaciones');
        return;
      }

      setPublicaciones(data);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    }
  };

  const handleEliminar = async (id: string) => {
    const confirm = window.confirm('¿Estás seguro de eliminar esta publicación?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/publicaciones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al eliminar publicación');
        return;
      }

      setMensaje('✅ Publicación eliminada');
      setTimeout(() => setMensaje(''), 3000);
      fetchPublicaciones();
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Mis Publicaciones</h1>

        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {publicaciones.length === 0 ? (
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
                      onClick={() => router.push(`/dashboard/trabajador/publicaciones/editar/${publi._id}`)}
                      className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(publi._id)}
                      className="text-sm px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
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
