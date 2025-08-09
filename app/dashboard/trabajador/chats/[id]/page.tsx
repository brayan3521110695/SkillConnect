'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Mensaje {
  _id: string;
  contenido: string;
  tipoUsuario: string;
  de: string;
  creadoEn?: string; 
  leido: boolean;
}

export default function ChatTrabajadorDetalle() {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(`/api/mensajes/${id}`);
        const data = await res.json();        
        setMensajes(data);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      } finally {
        setCargando(false);
      }
    };

    if (id) fetchMensajes();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mensajes de la conversación</h1>
      {cargando ? (
        <p>Cargando mensajes...</p>
      ) : (
        <div className="space-y-3">
          {mensajes.map((msg) => {
            const esTrabajador = msg.tipoUsuario?.toLowerCase() === 'trabajador';
            return (
              <div
                key={msg._id}
                className={`p-3 rounded-lg shadow max-w-[80%] sm:max-w-md w-fit
                  ${esTrabajador
                    ? 'bg-blue-100 ml-auto text-right'  // 👉 burbuja a la derecha
                    : 'bg-green-100 mr-auto text-left'  // 👉 burbuja a la izquierda
                  }`}
              >
                <p className="text-sm">{msg.contenido || 'Mensaje vacío'}</p>

                {msg.creadoEn ? (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.creadoEn).toLocaleString('es-MX', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic mt-1">Sin fecha</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
