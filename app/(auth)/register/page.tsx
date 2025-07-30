'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
  BriefcaseIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState<'trabajador' | 'cliente'>('cliente');
  const [aceptaAviso, setAceptaAviso] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Correo electrónico no válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!aceptaAviso) {
      setError('Debes aceptar el Aviso de Privacidad');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          password,
          tipo: rol,
          especialidad: rol === 'trabajador' ? 'general' : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear cuenta');
        return;
      }

      alert('✅ Cuenta creada exitosamente. Por favor inicia sesión.');
      router.push('/login');
    } catch (err) {
      console.error('❌ Error en el registro:', err);
      setError('Hubo un problema con el servidor');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Formulario */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center px-6 sm:px-12">
          <div className="w-full max-w-sm py-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center lg:text-left">Crear Cuenta</h1>

            {error && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900"
                  placeholder="Nombre(s)"
                  required
                />
              </div>

              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900"
                  placeholder="Apellidos"
                  required
                />
              </div>

              <div className="relative">
                <AtSymbolIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900"
                  placeholder="Correo electrónico"
                  required
                />
              </div>

              <div className="relative">
                <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900"
                  placeholder="Contraseña"
                  required
                />
              </div>

              <div className="relative">
                <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900"
                  placeholder="Confirmar Contraseña"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Continuar como</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRol('trabajador')}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg transition ${
                      rol === 'trabajador'
                        ? 'bg-blue-100 border-blue-500 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <BriefcaseIcon className="h-5 w-5" />
                    Trabajador
                  </button>
                  <button
                    type="button"
                    onClick={() => setRol('cliente')}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg transition ${
                      rol === 'cliente'
                        ? 'bg-blue-100 border-blue-500 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Cliente
                  </button>
                </div>
              </div>

              {/* Checkbox Aviso de Privacidad */}
              <label className="flex items-start gap-2 text-sm mt-2">
                <input
                  type="checkbox"
                  checked={aceptaAviso}
                  onChange={(e) => setAceptaAviso(e.target.checked)}
                  className="mt-1"
                />
                Acepto el{' '}
                <a
                  href="/aviso-de-privacidad"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Aviso de Privacidad
                </a>
              </label>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Registrarme
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ó continuar con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition">
                <FcGoogle className="h-5 w-5" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition">
                <FaGithub className="h-5 w-5" />
                GitHub
              </button>
            </div>

            <div className="mt-6 text-sm text-center text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen lateral derecha */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <Image
          src="/images/register.png"
          alt="Imagen de trabajador"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
