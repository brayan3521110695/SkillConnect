// app/api/resenas/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect';
import Resena from '@/models/resena';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const idServicio = searchParams.get('idServicio');

  if (!idServicio) {
    return NextResponse.json({ error: 'Falta idServicio' }, { status: 400 });
  }

  const resenas = await Resena.find({ idServicio }).sort({ fecha: -1 });
  return NextResponse.json(resenas);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const nueva = await Resena.create(body);
  return NextResponse.json(nueva);
}
