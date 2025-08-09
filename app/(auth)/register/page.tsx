'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserIcon, BriefcaseIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'trabajador'>('cliente');
  const [especialidad, setEspecialidad] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!accepted) {
      setError('Debes aceptar los Términos y el Aviso de Privacidad.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          password,
          tipo,
          especialidad: tipo === 'trabajador' ? especialidad : undefined,
          // Guarda el consentimiento (ajusta versión si cambias tu aviso)
          consent: {
            privacyVersion: '2025-08-08',
            privacyAcceptedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center lg:text-left">Crear Cuenta</h1>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre(s)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

            {/* Rol */}
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                  tipo === 'trabajador' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setTipo('trabajador')}
              >
                <BriefcaseIcon className="h-5 w-5" /> Trabajador
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                  tipo === 'cliente' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setTipo('cliente')}
              >
                <UserIcon className="h-5 w-5" /> Cliente
              </button>
            </div>

            {tipo === 'trabajador' && (
              <input
                type="text"
                placeholder="Especialidad (Ej: Plomero)"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            )}

            {/* Consentimiento */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
              />
              <span className="text-gray-700">
                Acepto los{' '}
                <Link href="/terminos" className="text-blue-600 underline">
                  Términos de uso
                </Link>{' '}
                y el{' '}
                <Link href="/aviso-de-privacidad" className="text-blue-600 underline">
                  Aviso de Privacidad
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!accepted || loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando…' : 'Registrarme'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Imagen derecha */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <Image
          src="/images/register.png"
          alt="Ilustración de registro"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
