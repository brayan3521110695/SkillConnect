'use client';

import { useState, useEffect } from "react";
import {
  FaPaperPlane,
  FaSearch,
  FaSmile,
  FaMicrophone,
  FaRegHeart,
  FaImage,
  FaInfoCircle,
  FaVideo,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";

function formatFecha(fechaISO: string) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MensajesPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const enviarMensaje = async () => {
    if (!input.trim() || !selectedChat || !userId) return;

    const nuevo = {
      conversacionId: selectedChat._id,
      remitente: userId,
      mensaje: input,
    };

    const res = await fetch('/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });

    const guardado = await res.json();
    setMensajes((prev) => [...prev, guardado]);
    setInput("");
  };

  const cargarMensajes = async (conversacionId: string) => {
    const res = await fetch(`/api/mensajes/${conversacionId}`);
    const data = await res.json();
    setMensajes(data);
  };

  useEffect(() => {
    const obtenerConversaciones = async () => {
      const res = await fetch('/api/conversaciones');
      const data = await res.json();
      setChats(data);
      if (data.length > 0) {
        setSelectedChat(data[0]);
        cargarMensajes(data[0]._id);
      }
    };

    obtenerConversaciones();
  }, []);

  let lastDate = "";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Lista de chats */}
      <aside className={`bg-white w-64 lg:w-80 border-r border-gray-200 p-4 overflow-y-auto z-40 fixed h-full transition-transform duration-300 ${menuAbierto ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <a href="/dashboard/trabajador" className="text-blue-500 hover:text-blue-700 text-base" title="Volver al inicio">
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

        {chats.map((chat) => {
          const otroParticipante = chat.participantes.find((p: any) => p._id !== userId);

          return (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setMenuAbierto(false);
                cargarMensajes(chat._id);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${selectedChat?._id === chat._id ? "bg-gray-100" : ""}`}
            >
              <img src="/images/avatar_default.png" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-800">{otroParticipante?.nombre || "Usuario"}</span>
                </div>
                <p className="text-gray-600 text-sm truncate">Haz clic para ver mensajes</p>
              </div>
            </div>
          );
        })}
      </aside>

      {/* Chat activo */}
      <section className="flex-1 flex flex-col h-full lg:ml-80">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <a href="/dashboard/trabajador" className="text-blue-500 hover:text-blue-700 text-xl block lg:hidden" title="Volver al inicio">
              <FaArrowLeft />
            </a>
            {selectedChat && (
              <>
                <img src="/images/avatar_default.png" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedChat.participantes.find((p: any) => p._id !== userId)?.nombre || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">Activo ahora</p>
                </div>
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-500">
            <FaPhone className="cursor-pointer hover:text-gray-700" />
            <FaVideo className="cursor-pointer hover:text-gray-700" />
            <FaInfoCircle className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto bg-gray-50 space-y-4 text-sm">
          {mensajes.map((msg, idx) => {
            const fechaMsg = new Date(msg.fecha).toDateString();
            const showFecha = fechaMsg !== lastDate;
            lastDate = fechaMsg;

            return (
              <div key={idx} className="flex flex-col items-center">
                {showFecha && (
                  <div className="text-xs text-gray-500 my-2">
                    {formatFecha(msg.fecha)}
                  </div>
                )}
                <div
                  className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-xl shadow text-sm ${msg.remitente === userId ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-gray-800 self-start"}`}
                >
                  {msg.mensaje}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
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
      </section>
    </div>
  );
}
