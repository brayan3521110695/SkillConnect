'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditarPublicacionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { status } = useSession(); // control de sesión por cookie
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [imagenURL, setImagenURL] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Redirige si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Carga la publicación
  useEffect(() => {
    if (!id || status !== 'authenticated') return;

    (async () => {
      try {
        setCargando(true);
        setError('');

        const res = await fetch(`/api/publicaciones/${id}`, { cache: 'no-store' }); // sin Authorization
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'No se pudo cargar la publicación');
          setCargando(false);
          return;
        }

        setTitulo(data.titulo ?? '');
        setDescripcion(data.descripcion ?? '');
        setCategoria(data.categoria ?? '');
        setPrecio(String(data.precio ?? ''));
        setDisponibilidad(data.disponibilidad ?? '');
        setFecha((data.fecha ?? '').slice(0, 10)); // si es ISO, recorta a yyyy-mm-dd
        setImagenURL(data.imagen ?? '');
        setPreview(data.imagen ?? '');
      } catch (e) {
        console.error(e);
        setError('Error al conectar con el servidor');
      } finally {
        setCargando(false);
      }
    })();
  }, [id, status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNuevaImagen(file);
    setPreview(file ? URL.createObjectURL(file) : imagenURL || null);
  };

  // Sube imagen sin Authorization (sesión via cookie)
  const subirImagen = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('❌ Error subiendo imagen:', data);
        return null;
      }
      return data.secure_url || null;
    } catch (err) {
      console.error('❌ Error subiendo imagen:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validaciones mínimas
    if (!titulo.trim()) return setError('El título es obligatorio');
    if (!descripcion.trim()) return setError('La descripción es obligatoria');
    if (precio && Number.isNaN(Number(precio))) return setError('Precio inválido');

    try {
      setGuardando(true);
      let urlImagen = imagenURL;

      if (nuevaImagen) {
        const subida = await subirImagen(nuevaImagen);
        if (!subida) throw new Error('No se pudo subir la nueva imagen');
        urlImagen = subida;
      }

      const res = await fetch(`/api/publicaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // sin Authorization
        body: JSON.stringify({
          titulo,
          descripcion,
          precio: precio ? Number(precio) : undefined,
          disponibilidad,
          fecha,
          categoria,
          imagen: urlImagen,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar');
      }

      setMensaje('✅ Publicación actualizada');
      setTimeout(() => router.push('/dashboard/trabajador'), 1200);
    } catch (err: any) {
      setError(err?.message || 'Error inesperado');
    } finally {
      setGuardando(false);
    }
  };

  if (status === 'loading' || cargando) {
    return <div className="max-w-2xl mx-auto p-6 mt-10">Cargando…</div>;
  }
  if (status === 'unauthenticated') return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Editar Publicación</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Título"
          className="w-full border p-3 rounded-md"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border p-3 rounded-md resize-none"
          rows={4}
          required
        />

        <input
          type="number"
          placeholder="Precio"
          className="w-full border p-3 rounded-md"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="0"
        />

        <input
          type="text"
          placeholder="Disponibilidad (Ej: Mañana)"
          className="w-full border p-3 rounded-md"
          value={disponibilidad}
          onChange={(e) => setDisponibilidad(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-3 rounded-md"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full border p-3 rounded-md bg-white"
        >
          <option value="">Selecciona una categoría</option>
          <option value="electricidad">Electricidad</option>
          <option value="jardinería">Jardinería</option>
          <option value="limpieza">Limpieza</option>
          <option value="plomería">Plomería</option>
        </select>

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="w-full max-h-64 object-cover rounded-md"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-blue-500 file:text-white hover:file:from-purple-600 hover:file:to-blue-600"
        />

        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
