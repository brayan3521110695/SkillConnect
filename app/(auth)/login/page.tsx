'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<'trabajador' | 'cliente'>('trabajador');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Email no válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tipo })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.usuario.tipo);

      router.push(data.usuario.tipo === 'trabajador' ? '/dashboard/trabajador' : '/dashboard/cliente/home');

    } catch (err) {
      console.error(err);
      setError('Hubo un error con el servidor');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center lg:text-left">Iniciar Sesión</h1>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AtSymbolIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                Recuérdame
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="relative mb-6 mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ó continuar con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="h-5 w-5" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaGithub className="h-5 w-5" />
              GitHub
            </button>
          </div>

          <div className="mt-6 text-sm text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>

      {/* Imagen derecha */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <Image
          src="/images/login.png"
          alt="Ilustración de trabajo"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
