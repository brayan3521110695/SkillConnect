import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Trabajador from '@/models/trabajador'; 

export async function GET() {
  await dbConnect();

  try {
    const trabajadores = await Trabajador.find({});
    return NextResponse.json(trabajadores);
  } catch (error) {
    console.error('❌ Error al obtener trabajadores:', error);
    return NextResponse.json({ error: 'Error al obtener los trabajadores' }, { status: 500 });
  }
}
