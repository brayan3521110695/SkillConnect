'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CrearPublicacionPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!titulo || !descripcion || !precio || !disponibilidad || !fecha || !categoria || !imagen) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('precio', precio);
    formData.append('disponibilidad', disponibilidad);
    formData.append('fecha', fecha);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('imagen', imagen);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/publicaciones', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje('✅ Publicación creada con éxito');
      setTimeout(() => router.push('/dashboard/trabajador'), 1500);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      setError('Error al crear la publicación');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Crear nueva publicación</h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {mensaje && <p className="text-green-600 text-center mb-4">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Título del servicio"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            rows={3}
            placeholder="Descripción del servicio"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <input
            type="text"
            placeholder="Disponibilidad (Ej: Mañana)"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
          />

          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            <option value="Limpieza">Limpieza</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Jardinería">Jardinería</option>
            <option value="Plomería">Plomería</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
            <input
              type="file"
              id="imagenInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="imagenInput"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm shadow hover:opacity-90 cursor-pointer transition"
            >
              Elegir imagen
            </label>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-full max-h-64 object-cover mt-4 rounded-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
          >
            Publicar
          </button>
        </form>
      </div>
    </main>
  );
}
