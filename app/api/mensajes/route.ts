import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Mensaje from '@/models/mensaje';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { conversacionId, remitente, mensaje } = await req.json();

    const nuevo = await Mensaje.create({ conversacionId, remitente, mensaje });
    return NextResponse.json(nuevo);
  } catch {
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
