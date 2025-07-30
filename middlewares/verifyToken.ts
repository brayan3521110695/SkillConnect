import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('Token no enviado');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secreto');
  } catch {
    throw new Error('Token inválido');
  }
};


export const config = {
  matcher: [
    '/cliente/home/:path*',
    '/dashboard/:path*',
    '/trabajador/:path*'
  ],
};
