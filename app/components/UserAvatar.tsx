'use client';
import React from 'react';
import { usePublicUser } from '@/app/hooks/usePublicUser';

export default function UserAvatar({
  userId, size = 40, className = ''
}: { userId?: string | null; size?: number; className?: string }) {
  const { user } = usePublicUser(userId);
  const src = user?.foto || '/images/user.jpg';
  const alt = user?.nombre || 'Usuario';
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
