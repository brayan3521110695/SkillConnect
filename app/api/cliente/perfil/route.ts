// app/api/cliente/perfil/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/authOptions';
import connectDB from '../../../../lib/dbConnect';
import Cliente from '../../../../models/cliente';
import Trabajador from '../../../../models/trabajador';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PerfilDoc = {
  _id: string;
  nombre: string;
  email: string;
  image?: string;
  foto?: string; // por si tu esquema viejo usa 'foto'
  rol?: 'cliente' | 'trabajador';
};

function mapUser(u: PerfilDoc) {
  return {
    id: u._id,
    nombre: u.nombre,
    email: u.email,
    image: u.image ?? u.foto ?? '/images/user.jpg',
    rol: u.rol,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const userId = user?.id;
    const email = user?.email;
    const rol = (user?.rol as 'cliente' | 'trabajador') || 'cliente';

    if (!userId && !email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const Model = rol === 'trabajador' ? Trabajador : Cliente;
    const filtro: any = email ? { email } : { _id: userId };

    const usuario = await Model.findOne(filtro).lean<PerfilDoc>();
    if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    return NextResponse.json({ usuario: mapUser(usuario) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const userId = user?.id;
    const email = user?.email;
    const rol = (user?.rol as 'cliente' | 'trabajador') || 'cliente';

    if (!userId && !email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { nombre, email: nuevoEmail, image } = await req.json();

    await connectDB();
    const Model = rol === 'trabajador' ? Trabajador : Cliente;
    const filtro: any = email ? { email } : { _id: userId };

    // guarda en ambos campos (image/foto) para compatibilidad
    const update: Partial<PerfilDoc> = {};
    if (nombre) update.nombre = nombre;
    if (image) {
      update.image = image;
      (update as any).foto = image;
    }
    if (nuevoEmail) update.email = nuevoEmail;

    const updated = await Model.findOneAndUpdate(filtro, update, { new: true }).lean<PerfilDoc>();
    if (!updated) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    return NextResponse.json({ ok: true, usuario: mapUser(updated) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
