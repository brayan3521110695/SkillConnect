"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaPaperPlane, FaSearch, FaSmile, FaMicrophone, FaRegHeart,
  FaImage, FaInfoCircle, FaVideo, FaPhone, FaArrowLeft
} from "react-icons/fa";
import { useUsuarioActual } from "@/app/hooks/useUsuarioActual";

function formatFecha(fechaISO?: string) {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-MX", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ChatsClientePage() {
  const usuario = useUsuarioActual();

  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ID estable del usuario (evita depender del objeto completo)
  const userId = useMemo(
    () => usuario?._id ?? (typeof window !== "undefined" ? localStorage.getItem("userId") : null),
    [usuario?._id]
  );

  // --- Cargar conversaciones SOLO UNA VEZ por usuario ---
  const convLoadedRef = useRef(false);
  useEffect(() => {
    if (!userId) return;
    if (convLoadedRef.current) return; // evita doble ejecución (StrictMode)
    convLoadedRef.current = true;

    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/conversaciones?clienteId=${userId}`, {
          cache: "no-store",
          signal: ac.signal,
        });
        const data = await res.json();
        if (ac.signal.aborted) return;

        const lista = Array.isArray(data) ? data : [];
        setConversaciones(lista);

        // Seleccionar el primer chat SOLO si aún no hay uno seleccionado
        if (!selectedChat && lista.length > 0) {
          setSelectedChat(lista[0]);
        }
      } catch (e) {
        if (!ac.signal.aborted) {
          console.error("Error al obtener conversaciones:", e);
          setConversaciones([]);
        }
      }
    })();

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // <-- solo depende de userId

  // --- Cargar mensajes una sola vez por chat seleccionado ---
  const fetchedMsgsForRef = useRef<string | null>(null);
  const selectedChatId = selectedChat?._id as string | undefined;

  useEffect(() => {
    if (!selectedChatId) return;
    if (fetchedMsgsForRef.current === selectedChatId) return; // ya cargados
    fetchedMsgsForRef.current = selectedChatId;

    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/mensajes?conversacionId=${selectedChatId}`, {
          cache: "no-store",
          signal: ac.signal,
        });
        const data = await res.json();
        if (ac.signal.aborted) return;
        setMensajes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ac.signal.aborted) {
          console.error("Error al obtener mensajes:", e);
          setMensajes([]);
        }
      }
    })();

    return () => ac.abort();
  }, [selectedChatId]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!input.trim() || !selectedChatId || !userId) return;

    const nuevoMensaje = {
      conversacionId: selectedChatId,
      contenido: input.trim(),
      de: userId,
      tipoUsuario: "cliente",
      creadoEn: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMensaje),
      });
      const data = await res.json();
      setMensajes((prev) => [...prev, data]);
      setInput("");
    } catch (e) {
      console.error("Error al enviar mensaje:", e);
    }
  };

  // Auto scroll al final
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* SIDEBAR */}
      <aside
        className={`bg-white w-64 lg:w-80 border-r border-gray-200 p-4 overflow-y-auto z-40 fixed h-full transition-transform duration-300 ${
          menuAbierto ? "block" : "hidden"
        } lg:block`}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <a href="/dashboard/cliente/home" className="text-blue-500 hover:text-blue-700 text-base" title="Volver al inicio">
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

        {conversaciones.length === 0 && (
          <p className="text-gray-500 text-sm">No hay conversaciones aún.</p>
        )}

        {conversaciones.map((chat) => {
          const otro = chat.participantes?.find((p: any) => p?._id !== userId) || {};
          const activo = selectedChatId === chat._id;
          return (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setMenuAbierto(false);
                // permitir recarga de mensajes al cambiar de chat
                fetchedMsgsForRef.current = null;
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                activo ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={otro.avatar || chat.avatar || "/images/user.jpg"}
                className="w-10 h-10 rounded-full object-cover"
                alt="Avatar"
              />
              <div className="flex-1">
                <span className="font-semibold text-gray-800 text-sm">
                  {otro.nombre || chat.nombre || "Usuario"}
                </span>
                <p className="text-gray-600 text-xs truncate">
                  {chat.ultimoMensaje || "Haz clic para ver mensajes"}
                </p>
              </div>
            </div>
          );
        })}
      </aside>

      {/* PANEL DE CONVERSACIÓN */}
      <section className="flex-1 flex flex-col h-full lg:ml-80">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <a href="/dashboard/cliente/home" className="text-blue-500 hover:text-blue-700 text-xl block lg:hidden" title="Volver al inicio">
              <FaArrowLeft />
            </a>
            {selectedChat && (() => {
              const otro = selectedChat.participantes?.find((p: any) => p?._id !== userId) || {};
              return (
                <>
                  <img
                    src={otro.avatar || selectedChat.avatar || "/images/user.jpg"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Avatar"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {otro.nombre || selectedChat.nombre || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500">Activo ahora</p>
                  </div>
                </>
              );
            })()}
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
              typeof msg.de === "string" ? msg.de : (msg.de && (msg.de as any)._id) || "";
            const mio = (deId || "").toString() === (userId || "").toString();

            return (
              <div key={idx} className={`flex flex-col ${mio ? "items-end" : "items-start"}`}>
                <div className="text-xs text-gray-500 my-1">
                  {msg.creadoEn ? formatFecha(msg.creadoEn) : "Sin fecha"}
                </div>
                <div
                  className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
                    mio ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                  title={msg.creadoEn ? formatFecha(msg.creadoEn) : ""}
                >
                  {msg.contenido}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Composer */}
        {selectedChat && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-3">
            <FaSmile className="text-xl text-gray-500 cursor-pointer" />
            <FaImage className="text-xl text-gray-500 cursor-pointer" />
            <FaMicrophone className="text-xl text-gray-500 cursor-pointer" />
            <FaRegHeart className="text-xl text-gray-500 cursor-pointer" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
              type="text"
              placeholder="Enviar mensaje..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={enviarMensaje} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
              <FaPaperPlane />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
