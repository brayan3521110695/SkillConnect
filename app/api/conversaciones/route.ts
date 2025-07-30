import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Conversacion from '@/models/conversacion';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { usuario1, usuario2 } = await req.json();

    // Verifica si ya existe
    let existente = await Conversacion.findOne({
      participantes: { $all: [usuario1, usuario2] }
    });

    if (existente) return NextResponse.json(existente);

    const nueva = await Conversacion.create({ participantes: [usuario1, usuario2] });
    return NextResponse.json(nueva);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear conversación' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const conversaciones = await Conversacion.find().populate('participantes');
    return NextResponse.json(conversaciones);
  } catch {
    return NextResponse.json({ error: 'Error al obtener conversaciones' }, { status: 500 });
  }
}
