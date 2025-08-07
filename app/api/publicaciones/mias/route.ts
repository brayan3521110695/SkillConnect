import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Publicacion from '@/models/publicacion';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: 'No autorizado (token no presente)' }, { status: 401 });
    }

    if (token.rol !== 'trabajador') {
      return NextResponse.json({ error: 'No autorizado (solo trabajadores)' }, { status: 403 });
    }

    const publicaciones = await Publicacion.find({
      trabajadorId: token.sub || token.id
    }).sort({ createdAt: -1 });

    return NextResponse.json(publicaciones);
  } catch (err: any) {
    console.error('❌ Error en GET /publicaciones/mias:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
