import { NextRequest, NextResponse } from 'next/server';
import Publicacion from '@/models/publicacion';
import { verifyToken } from '@/middlewares/verifyToken';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/dbConnect';


// DELETE /api/publicaciones/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // ✅ así accedes a params.id

  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const userId = (decoded as any).id;

  const publicacion = await Publicacion.findById(id);
  if (!publicacion || publicacion.trabajadorId.toString() !== userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  await Publicacion.findByIdAndDelete(id);
  return NextResponse.json({ mensaje: 'Eliminado correctamente' });
}

// GET /api/publicaciones/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const decoded = verifyToken(req);
  const userId = (decoded as any).id;

  const publicacion = await Publicacion.findById(params.id);

  if (!publicacion || publicacion.trabajadorId.toString() !== userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  return NextResponse.json(publicacion);
}

// PUT /api/publicaciones/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const decoded = verifyToken(req);
  const userId = (decoded as any).id;

  const body = await req.json();
  const { descripcion, categoria, imagen } = body;

  const publicacion = await Publicacion.findById(params.id);

  if (!publicacion || publicacion.trabajadorId.toString() !== userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  publicacion.descripcion = descripcion;
  publicacion.categoria = categoria;
  publicacion.imagen = imagen;

  await publicacion.save();

  return NextResponse.json(publicacion);
}