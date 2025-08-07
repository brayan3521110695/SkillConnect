import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Trabajador from '@/models/trabajador'; 

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const trabajador = await Trabajador.findById(params.id);

    if (!trabajador) {
      return NextResponse.json({ error: 'Trabajador no encontrado' }, { status: 404 });
    }

    return NextResponse.json(trabajador);
  } catch (error) {
    console.error('Error al obtener trabajador:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
