'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUsuarioActual } from '@/app/hooks/useUsuarioActual';
import { FaPaperPlane } from 'react-icons/fa';

interface Usuario {
  _id: string;
  nombre: string;
  email?: string;
  rol: 'cliente' | 'trabajador';
}

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
  const usuarioActual = useUsuarioActual() as Usuario | null;

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await fetch(`/api/mensajes?conversacionId=${id}`);
        const data = await res.json();
        setMensajes(data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
    };
    obtenerMensajes();
  }, [id]);

  useEffect(() => {
    mensajesRef.current?.scrollTo({
      top: mensajesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [mensajes]);

  const enviarMensaje = async () => {
    const contenidoLimpio = nuevoMensaje.trim();
    if (!contenidoLimpio || !usuarioActual?._id) return;

    const tipoUsuario = usuarioActual.rol === 'cliente' ? 'Cliente' : 'Trabajador';

    try {
      const res = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversacionId: id,
          contenido: contenidoLimpio,
          de: usuarioActual._id, // ✅ corregido
          tipoUsuario,
        }),
      });

      const data = await res.json();
      if (!res.ok) return;

      const mensajeFormateado: Mensaje = {
        ...data,
        contenido: contenidoLimpio,
        de: {
          _id: usuarioActual._id,
          nombre: usuarioActual.nombre || 'Anónimo',
        },
      };

      setMensajes((prev) => [...prev, mensajeFormateado]);
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  if (!usuarioActual) return null;

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Conversación</h1>

      <div
        ref={mensajesRef}
        className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white shadow-sm space-y-4 max-h-[70vh]"
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
                className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow max-w-xs text-sm relative
                    ${esPropio
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  title={msg.creadoEn ? new Date(msg.creadoEn).toLocaleTimeString() : ''}
                >
                  {msg.contenido || '[Mensaje vacío]'}
                  <div className="text-[10px] mt-1 text-right opacity-70">
                    {msg.creadoEn ? new Date(msg.creadoEn).toLocaleTimeString() : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') enviarMensaje();
          }}
        />
        <button
          className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={enviarMensaje}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
