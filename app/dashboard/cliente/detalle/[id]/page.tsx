'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { servicios } from '../../../../data/servicios';
import { FaArrowLeft, FaHeart, FaRegHeart, FaRegCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import Resenas from '../../../../components/resenas';

export default function DetalleServicio() {
  const { id } = useParams();
  const [servicio, setServicio] = useState<any>(null);
  const [favorito, setFavorito] = useState(false);

  // Simular usuario logueado
  const usuario = {
    _id: '123',
    nombre: 'Josue Valerio',
  };

  useEffect(() => {
    const encontrado = servicios.find((s) => s.id === id);
    if (encontrado) setServicio(encontrado);
  }, [id]);

  if (!servicio) return <div className="p-10">Servicio no encontrado</div>;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Botón volver */}
      <div className="mb-6">
        <Link href="/dashboard/cliente/home">
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <FaArrowLeft />
            Volver al listado
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-md p-6 rounded-md">
        {/* Título, fecha y favorito */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{servicio.titulo}</h2>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <FaRegCalendarAlt />
              <span>{servicio.fecha}</span>
            </div>
          </div>
          <button
            onClick={() => setFavorito(!favorito)}
            className="text-red-500 text-xl hover:scale-110 transition-transform"
            title="Guardar en favoritos"
          >
            {favorito ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Estrellas */}
        <div className="flex text-yellow-400 mb-4 text-xl">
          {'★'.repeat(servicio.rating)}{'☆'.repeat(5 - servicio.rating)}
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Descripción</h3>
          <p className="text-gray-700">{servicio.descripcion}</p>
        </div>

        {/* Imágenes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-2">
          {servicio.imagenes?.map((src: string, index: number) => (
            <Image
              key={index}
              src={src}
              alt={`Imagen ${index + 1}`}
              width={400}
              height={250}
              className="rounded-lg object-cover w-full h-44"
            />
          ))}
        </div>

        {/* Botón de contratar */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <Link href={`/cliente/pago/${id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow w-full sm:w-auto">
              Contratar este servicio
            </button>
          </Link>     
        </div>
        {/* Reseñas reales */}
        <Resenas
          idServicio={String(id)}
          autorId={usuario._id}
          nombreAutor={usuario.nombre}
        />
      </div>
    </div>
  );
}
