import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Mensaje from '@/models/mensaje';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const mensajes = await Mensaje.find({ conversacionId: params.id }).sort({ fecha: 1 });
    return NextResponse.json(mensajes);
  } catch {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}
