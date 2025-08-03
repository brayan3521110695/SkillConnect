import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Mensaje from '@/models/mensaje';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { conversacionId, contenido, de } = await req.json();

    // ❗ Validación para evitar guardar mensajes vacíos
    if (!contenido || contenido.trim() === '') {
      return NextResponse.json({ error: 'El contenido del mensaje está vacío' }, { status: 400 });
    }

    const nuevo = await Mensaje.create({
      conversacion: conversacionId,
      contenido: contenido.trim(), // ✂️ limpiamos espacios
      de
    });

    const mensajeCompleto = await nuevo.populate('de');
    return NextResponse.json(mensajeCompleto);
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url || '');
    const conversacionId = url.searchParams.get('conversacionId');

    if (!conversacionId) {
      return NextResponse.json({ error: 'ID de conversación requerido' }, { status: 400 });
    }

    const mensajes = await Mensaje.find({ conversacion: conversacionId })
      .populate('de')
      .sort({ creadoEn: 1 });

    return NextResponse.json(mensajes);
  } catch {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}

