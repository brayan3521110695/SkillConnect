import { useSession } from 'next-auth/react';

interface UsuarioActual {
  _id: string; // ✅ nombre correcto esperado por la API
  nombre: string;
  email: string;
  rol: 'cliente' | 'trabajador';
}

export function useUsuarioActual(): UsuarioActual | null {
  const { data, status } = useSession();

  if (
    status === 'loading' ||
    !data?.user ||
    !('rol' in data.user) ||
    !('nombre' in data.user)
  ) {
    return null;
  }

  return {
    _id: (data.user as any).id, // ✅ mapear correctamente como _id
    nombre: data.user.nombre,
    email: data.user.email,
    rol: data.user.rol
  };
}

