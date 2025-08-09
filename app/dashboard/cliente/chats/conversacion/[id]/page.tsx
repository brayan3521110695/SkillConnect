'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaPaperPlane, FaSearch, FaSmile, FaMicrophone, FaRegHeart,
  FaImage, FaInfoCircle, FaVideo, FaPhone, FaArrowLeft
} from 'react-icons/fa';
import { usePublicUser } from '@/app/hooks/usePublicUser';

// Utilidad para formatear fecha
function formatFecha(fechaISO?: string) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Avatar + nombre en vivo, con subtítulo opcional (todo en un solo componente)
function UserChip({
  userId,
  size = 40,            // px
  showName = true,
  showAvatar = true,
  subtitle,
  className = '',
}: {
  userId: string | null | undefined;
  size?: number;
  showName?: boolean;
  showAvatar?: boolean;
  subtitle?: string;
  className?: string;
}) {
  const { user, isLoading } = usePublicUser(userId || null);
  const src =
    (user?.foto || '/images/user.jpg') +
    (user?.updatedAt ? `?v=${new Date(user.updatedAt).getTime()}` : '');
  const name = user?.nombre || 'Usuario';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAvatar && (
        <img
          src={src}
          alt={name}
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      )}
      {showName && (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">
            {isLoading ? 'Cargando…' : name}
          </span>
          {subtitle ? (
            <span className="text-xs text-gray-500">{subtitle}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function MensajesClientePage() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tu app guarda el id en localStorage
  const userId =
    typeof window !== 'undefined' ? String(localStorage.getItem('userId')) : null;

  // Id del otro participante del chat seleccionado
  const otherId = useMemo(() => {
    if (!selectedChat || !userId) return null;
    const otro = selectedChat.participantes?.find((p: any) => {
      const id = typeof p === 'string' ? p : p?._id;
      return String(id) !== String(userId);
    });
    return typeof otro === 'string' ? otro : otro?._id || null;
  }, [selectedChat, userId]);

  // Enviar mensaje (optimista y sin bucles)
  const enviarMensaje = async () => {
    if (!input.trim() || !selectedChat || !userId) return;

    const draft = {
      conversacionId: selectedChat._id,
      contenido: input.trim(),
      de: userId,
      tipoUsuario: 'cliente',
      creadoEn: new Date().toISOString(),
    };

    // Optimista
    setMensajes(prev => [...prev, draft]);
    setInput('');

    try {
      const res = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const guardado = await res.json();

      // Reemplaza el último (draft) por el guardado
      setMensajes(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = guardado || draft;
        return copy;
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  // Cargar mensajes SOLO cuando cambia de chat
  const cargarMensajes = async (conversacionId: string) => {
    try {
      const res = await fetch(`/api/mensajes?conversacionId=${conversacionId}`);
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMensajes([]); 
    }
  };

  // Autoscroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Cargar conversaciones UNA sola vez al entrar (sin intervalos)
  useEffect(() => {
    if (!userId) return;
    let aborted = false;

    const obtenerConversaciones = async () => {
      try {
        const res = await fetch(`/api/conversaciones?clienteId=${userId}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (aborted) return;

        if (Array.isArray(data)) {
          setChats(data);
          if (!selectedChat && data.length > 0) {
            setSelectedChat(data[0]);
            await cargarMensajes(data[0]._id);
          }
        } else {
          setChats([]);
        }
      } catch (e) {
        if (!aborted) {
          console.error('Error al obtener conversaciones:', e);
          setChats([]);
        }
      }
    };

    obtenerConversaciones();
    return () => { aborted = true; };
    // Dependemos sólo de userId para no espamear
  }, [userId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 lg:w-80 border-r border-gray-200 p-4 overflow-y-auto z-40 fixed h-full transition-transform duration-300 ${
          menuAbierto ? 'block' : 'hidden'
        } lg:block`}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <a
            href="/dashboard/cliente/home"
            className="text-blue-500 hover:text-blue-700 text-base"
            title="Volver al inicio"
          >
            <FaArrowLeft />
          </a>
          Mensajes
        </h2>

        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {chats.length === 0 && (
          <p className="text-gray-500 text-sm">No hay conversaciones aún.</p>
        )}

        {chats
          .filter((chat) => {
            const otro = chat.participantes?.find((p: any) => {
              const id = typeof p === 'string' ? p : p?._id;
              return String(id) !== String(userId);
            });
            return !!otro;
          })
          .map((chat) => {
            const otro = chat.participantes?.find((p: any) => {
              const id = typeof p === 'string' ? p : p?._id;
              return String(id) !== String(userId);
            });
            const otroId = typeof otro === 'string' ? otro : otro?._id || null;
            const activo = selectedChat?._id === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  setMenuAbierto(false);
                  cargarMensajes(chat._id);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                  activo ? 'bg-gray-100' : ''
                }`}
              >
                {/* Un SOLO componente: avatar + nombre + subtítulo */}
                <UserChip
                  userId={otroId}
                  showName
                  showAvatar
                  subtitle={chat.ultimoMensaje || 'Haz clic para ver mensajes'}
                />
              </div>
            );
          })}
      </aside>

      {/* Panel de conversación */}
      <section className="flex-1 flex flex-col h-full lg:ml-80">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard/cliente/home"
              className="text-blue-500 hover:text-blue-700 text-xl block lg:hidden"
              title="Volver al inicio"
            >
              <FaArrowLeft />
            </a>

            {/* Avatar + nombre con subtítulo "Activo ahora" */}
            <UserChip userId={otherId} subtitle="Activo ahora" />
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-500">
            <FaPhone className="cursor-pointer hover:text-gray-700" />
            <FaVideo className="cursor-pointer hover:text-gray-700" />
            <FaInfoCircle className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 px-4 py-4 overflow-y-auto bg-gray-50 space-y-4 text-sm">
          {mensajes.map((msg, idx) => {
            const deId =
              typeof msg.de === 'string' ? msg.de : (msg.de && (msg.de as any)._id) || '';
            const mio = (deId || '').toString() === (userId || '').toString();

            return (
              <div
                key={idx}
                className={`flex flex-col ${mio ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-gray-500 my-1">
                  {formatFecha(msg.creadoEn)}
                </div>

                <div
                  className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
                    mio ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.contenido}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-3">
          <FaSmile className="text-xl text-gray-500 cursor-pointer" />
          <FaImage className="text-xl text-gray-500 cursor-pointer" />
          <FaMicrophone className="text-xl text-gray-500 cursor-pointer" />
          <FaRegHeart className="text-xl text-gray-500 cursor-pointer" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            type="text"
            placeholder="Enviar mensaje..."
            className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={enviarMensaje}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <FaPaperPlane />
          </button>
        </div>
      </section>
    </div>
  );
}
