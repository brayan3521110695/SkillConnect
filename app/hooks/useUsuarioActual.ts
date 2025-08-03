import { useSession } from 'next-auth/react';

/**
 * Hook para obtener el usuario actualmente autenticado
 * Retorna null si no hay sesión iniciada
 */
export function useUsuarioActual() {
  const { data, status } = useSession();

  if (status === 'loading') return null;

  return data?.user ?? null;
}
