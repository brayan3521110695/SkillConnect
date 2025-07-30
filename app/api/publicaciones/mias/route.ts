import { NextResponse } from 'next/server';
import { verifyToken } from '@/middlewares/verifyToken';
import dbConnect from '@/lib/dbConnect';
import Publicacion from '@/models/publicacion';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const decoded = verifyToken(req);
    if ((decoded as any).tipo !== 'trabajador') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const publicaciones = await Publicacion.find({
      trabajadorId: decoded.id
    }).sort({ createdAt: -1 });

    return NextResponse.json(publicaciones);
  } catch (err: any) {
    console.error('❌ Error en GET /publicaciones/mias:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
