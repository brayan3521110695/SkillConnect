// app/api/usuarios/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Cliente from '@/models/cliente';
import Trabajador from '@/models/trabajador';

type PublicUser = {
  _id?: string;
  nombre?: string;
  email?: string;
  foto?: string;
  updatedAt?: Date | string | null;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    // Tipamos explícitamente los .lean<PublicUser>()
    const cliente = await Cliente.findById(id)
      .select('nombre email foto updatedAt')
      .lean<PublicUser>()
      .exec();

    const trabajador =
      cliente
        ? null
        : await Trabajador.findById(id)
            .select('nombre email foto updatedAt')
            .lean<PublicUser>()
            .exec();

    const u: PublicUser | null = cliente || trabajador;

    if (!u) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id,
      nombre: u.nombre ?? '',
      email: u.email ?? '',
      foto: u.foto ?? '/images/user.jpg',
      updatedAt: u.updatedAt ?? null,
    });
  } catch (e) {
    console.error('[GET /api/usuarios/:id] error:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
