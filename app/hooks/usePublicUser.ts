'use client';
import useSWR from 'swr';

type PublicUser = {
  id?: string;
  nombre?: string;
  email?: string;
  foto?: string;
  updatedAt?: string | null;
};

const fetcher = (url: string) =>
  fetch(url).then(r => { if (!r.ok) throw new Error('fetch error'); return r.json(); });

export function usePublicUser(userId?: string | null) {
  const { data, error, isLoading, mutate } = useSWR<PublicUser>(
    userId ? `/api/usuarios/${userId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60_000, keepPreviousData: true }
  );
  return { user: data, isLoading, error, refresh: mutate };
}
