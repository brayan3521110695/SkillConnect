// app/api/publicaciones/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Publicacion from '@/models/publicacion';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/authOptions';

type ParamsPromise = { params: Promise<{ id: string }> };

async function getUserFromAuth(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id  = (session.user as any).id ?? (session as any).user?.sub;
    const rol = (session.user as any).rol;
    if (id) return { id: String(id), rol };
  }
  const jwt = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  if (jwt) {
    const id  = (jwt as any).id ?? jwt.sub;
    const rol = (jwt as any).rol;
    if (id) return { id: String(id), rol };
  }
  return null;
}

function esAutor(pub: any, userId?: string) {
  return !!(pub && userId) && String(pub.trabajadorId) === String(userId);
}

export async function GET(req: Request, { params }: ParamsPromise) {
  await connectDB();
  const { id } = await params; // 👈 obligatorio

  const user = await getUserFromAuth(req);
  if (!user) return NextResponse.json({ error: 'No autorizado (sin sesión)' }, { status: 401 });

  const pub = await Publicacion.findById(id);
  if (!pub)   return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  if (!esAutor(pub, user.id)) return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  return NextResponse.json(pub);
}

export async function PUT(req: Request, { params }: ParamsPromise) {
  await connectDB();
  const { id } = await params; // 👈 obligatorio

  const user = await getUserFromAuth(req);
  if (!user) return NextResponse.json({ error: 'No autorizado (sin sesión)' }, { status: 401 });

  const body = await req.json();
  const { titulo, descripcion, categoria, imagen, precio, disponibilidad, fecha } = body;

  const pub = await Publicacion.findById(id);
  if (!pub)   return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  if (!esAutor(pub, user.id)) return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  if (titulo !== undefined)         pub.titulo = titulo;
  if (descripcion !== undefined)    pub.descripcion = descripcion;
  if (categoria !== undefined)      pub.categoria = categoria;
  if (imagen !== undefined)         pub.imagen = imagen;
  if (precio !== undefined)         pub.precio = precio;
  if (disponibilidad !== undefined) pub.disponibilidad = disponibilidad;
  if (fecha !== undefined)          pub.fecha = fecha;

  await pub.save();
  return NextResponse.json(pub);
}

export async function DELETE(req: Request, { params }: ParamsPromise) {
  await connectDB();
  const { id } = await params; // 👈 obligatorio

  const user = await getUserFromAuth(req);
  if (!user) return NextResponse.json({ error: 'No autorizado (sin sesión)' }, { status: 401 });

  const pub = await Publicacion.findById(id);
  if (!pub)   return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  if (!esAutor(pub, user.id)) return NextResponse.json({ error: 'Prohibido' }, { status: 403 });

  await pub.deleteOne();
  return NextResponse.json({ mensaje: 'Eliminado correctamente' });
}
