'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function TrabajadorServiciosPage() {
  const router = useRouter();

  const [servicios, setServicios] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioEditandoId, setServicioEditandoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    disponibilidad: ''
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    const res = await fetch('/api/servicios');
    const data = await res.json();
    setServicios(Array.isArray(data) ? data : []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleEditar = (servicio: any) => {
    setFormulario({
      titulo: servicio.titulo,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      categoria: servicio.categoria,
      disponibilidad: servicio.disponibilidad
    });
    setServicioEditandoId(servicio._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    const res = await fetch(`/api/servicios/${id}`, { method: 'DELETE' });
    if (res.ok) cargarServicios();
    else alert('Error al eliminar el servicio');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = servicioEditandoId
      ? `/api/servicios/${servicioEditandoId}`
      : '/api/servicios';
    const method = servicioEditandoId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formulario, trabajadorId: '123456789' })
    });

    if (res.ok) {
      setFormulario({ titulo: '', descripcion: '', precio: '', categoria: '', disponibilidad: '' });
      setMostrarFormulario(false);
      setModoEdicion(false);
      setServicioEditandoId(null);
      cargarServicios();
    } else {
      alert('Error al guardar el servicio');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-900">Mis servicios ofrecidos</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 text-sm hover:underline flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Volver
          </button>
        </div>

        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setModoEdicion(false);
            setServicioEditandoId(null);
            setFormulario({ titulo: '', descripcion: '', precio: '', categoria: '', disponibilidad: '' });
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6"
        >
          <FaPlus /> Agregar nuevo servicio
        </button>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <input
              name="titulo"
              placeholder="Título"
              value={formulario.titulo}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="precio"
              type="number"
              placeholder="Precio"
              value={formulario.precio}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="categoria"
              placeholder="Categoría"
              value={formulario.categoria}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="disponibilidad"
              placeholder="Disponibilidad"
              value={formulario.disponibilidad}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {modoEdicion ? 'Actualizar servicio' : 'Guardar servicio'}
            </button>
          </form>
        )}

        <ul className="space-y-4">
          {servicios.map((servicio: any) => (
            <li
              key={servicio._id}
              className="p-4 bg-gray-50 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-md font-bold text-gray-800">{servicio.titulo}</h3>
                <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                <p className="text-sm text-blue-800 font-semibold mt-1">
                  ${servicio.precio} MXN
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleEditar(servicio)}
                  className="flex items-center gap-1 text-sm text-yellow-600 hover:underline"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleEliminar(servicio._id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
