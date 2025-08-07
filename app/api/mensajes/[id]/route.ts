import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Mensaje from '@/models/mensaje';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const mensajes = await Mensaje.find({ conversacion: params.id })
      .sort({ creadoEn: 1 })
      .populate({
        path: 'de',
        select: 'nombre avatar email',
      });

    return NextResponse.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}
