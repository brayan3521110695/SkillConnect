import React from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

const TarjetaServicio = ({ servicio }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border flex flex-col justify-between">
      <img
        src={servicio.img}
        alt={servicio.titulo}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="flex justify-between items-center text-sm mb-2">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {servicio.categoria}
        </span>
        <span className="text-gray-500">{servicio.fecha}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {servicio.titulo}
      </h3>
      <p className="text-gray-800 font-bold mb-2">${servicio.precio}</p>

      {/* Estrellas */}
      <div className="flex items-center text-yellow-500 text-sm mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 mt-auto">
        <Link
          href={`/dashboard/cliente/detalle/${servicio.id}`}
          className="bg-green-600 hover:bg-green-700 text-white py-1 text-center rounded font-semibold"
        >
          Ver detalles
        </Link>

        <Link
          href={`/dashboard/trabajador/mensajes?para=${servicio.trabajadorId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 text-center rounded font-semibold"
        >
          Enviar mensaje
        </Link>
      </div>
    </div>
  );
};

export default TarjetaServicio;
