// app/api/publicaciones/mias/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import Publicacion from '@/models/publicacion';

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1) Intenta sesión de servidor (válida para strategy "database")
    const session = await getServerSession(authOptions);

    let userId: string | undefined;
    let rol: string | undefined;

    if (session?.user) {
      userId = (session.user as any).id;
      rol = (session.user as any).rol;
    } else {
      // 2) Si no hay session, intenta JWT (strategy "jwt")
      const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
      if (token) {
        userId = (token.id as string) ?? (token.sub as string);
        rol = (token.rol as string) || undefined;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado (sin sesión)' }, { status: 401 });
    }
    if (rol && rol !== 'trabajador') {
      return NextResponse.json({ error: 'No autorizado (solo trabajadores)' }, { status: 403 });
    }

    const publicaciones = await Publicacion.find({ trabajadorId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(publicaciones);
  } catch (err: any) {
    console.error('❌ Error en GET /publicaciones/mias:', err);
    return NextResponse.json({ error: err.message ?? 'Error interno' }, { status: 500 });
  }
}
