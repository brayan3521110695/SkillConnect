'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Mensaje {
  _id?: string;
  contenido: string;
  de?: {
    _id: string;
    nombre: string;
  };
  creadoEn?: string;
}

export default function ConversacionPage() {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const mensajesRef = useRef<HTMLDivElement>(null);

  const usuarioActual = {
    _id: '123', // Reemplázalo con el ID del usuario autenticado real
    nombre: 'Josue Valerio'
  };

  useEffect(() => {
    const obtenerMensajes = async () => {
      const res = await fetch(`/api/mensajes?conversacionId=${id}`);
      const data = await res.json();
      setMensajes(data);
    };

    obtenerMensajes();
  }, [id]);

  useEffect(() => {
    mensajesRef.current?.scrollTo(0, mensajesRef.current.scrollHeight);
  }, [mensajes]);

  const enviarMensaje = async () => {
    const contenidoLimpio = nuevoMensaje.trim();

    if (!contenidoLimpio) return;

    const res = await fetch('/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversacionId: id,
        contenido: contenidoLimpio,
        de: usuarioActual._id
      })
    });

    if (!res.ok) return;

    const nuevo = await res.json();

    const mensajeFormateado: Mensaje = {
      ...nuevo,
      contenido: contenidoLimpio,
      de: {
        _id: usuarioActual._id,
        nombre: usuarioActual.nombre
      }
    };

    setMensajes((prev) => [...prev, mensajeFormateado]);
    setNuevoMensaje('');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Conversación</h1>

      <div
        ref={mensajesRef}
        className="h-[400px] overflow-y-auto border p-4 rounded bg-white shadow mb-4"
      >
        {mensajes.length === 0 ? (
          <p className="text-gray-500">No hay mensajes aún.</p>
        ) : (
          mensajes.map((msg) => {
            const esPropio = msg?.de?._id === usuarioActual._id;
            const keyUnica =
              msg._id ?? `${msg.de?._id ?? 'sinremitente'}-${msg.creadoEn ?? Date.now()}`;

            return (
              <div
                key={keyUnica}
                className={`mb-3 flex ${esPropio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    esPropio ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">
                    {msg.contenido ? msg.contenido : '[Mensaje vacío]'}
                  </p>
                  <span className="block text-[11px] text-right text-gray-300 mt-1">
                    {msg.creadoEn
                      ? new Date(msg.creadoEn).toLocaleTimeString()
                      : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={enviarMensaje}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
