'use client';

import { useEffect, useRef, useState } from "react";
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
  FaBars,
} from "react-icons/fa";

const mockChats = [
  {
    id: "1",
    nombre: "Marcos_22",
    avatar: "/images/editables/user2.jpg",
    lastMessage: "¿Necesitas el servicio aún?",
    timestamp: "9:15 AM",
    unread: true,
    messages: [
      { from: "them", text: "¿Necesitas el servicio aún?", date: "2025-07-01T09:15:00" },
      { from: "me", text: "Sí, gracias por responder.", date: "2025-07-01T09:16:00" },
    ],
  },
];

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

export default function ChatsClientePage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [input, setInput] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const enviarMensaje = () => {
    if (!input.trim()) return;
    const nuevoMensaje = {
      from: "me",
      text: input,
      date: new Date().toISOString(),
    };
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, nuevoMensaje],
    }));
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat.messages]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white relative">

      {/* Fondo oscuro al abrir menú en móvil */}
      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white w-64 lg:w-80 border-r border-gray-200 p-4 overflow-y-auto z-40 
        fixed lg:static h-full transition-transform duration-300 
        ${menuAbierto ? 'block' : 'hidden'} lg:block`}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
          <a
            href="/dashboard/cliente"
            className="text-blue-500 hover:text-blue-700 text-base"
            title="Volver al inicio"
          >
            <FaArrowLeft />
          </a>
          Chat con trabajadores
        </h2>

        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {mockChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setSelectedChat(chat);
              setMenuAbierto(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition 
              ${selectedChat.id === chat.id ? "bg-gray-100" : ""}`}
          >
            <img src={chat.avatar} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800">{chat.nombre}</span>
                <span className="text-gray-400 text-xs relative">
                  {chat.timestamp}
                  {chat.unread && (
                    <span className="absolute top-0 -right-2 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </span>
              </div>
              <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </aside>

      {/* Chat activo */}
      <section className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuAbierto(true)}
              className="text-blue-500 text-xl block lg:hidden"
              title="Abrir menú"
            >
              <FaBars />
            </button>
            <img
              src={selectedChat.avatar}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{selectedChat.nombre}</p>
              <p className="text-xs text-gray-500">Disponible ahora</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-500">
            <FaPhone className="cursor-pointer hover:text-gray-700" />
            <FaVideo className="cursor-pointer hover:text-gray-700" />
            <FaInfoCircle className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto space-y-4 text-sm">
          {selectedChat.messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col items-center animate-fade-in">
              <div
                title={formatFecha(msg.date)}
                className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-xl shadow text-sm transition-all duration-200
                  ${msg.from === "me"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 bg-white">
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
