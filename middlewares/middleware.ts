import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middlewares(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = ['/login', '/register'].includes(path);
  const token = request.cookies.get('token')?.value;

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}