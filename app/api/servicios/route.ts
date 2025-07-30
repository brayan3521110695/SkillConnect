// app/api/servicios/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Servicio from '@/models/servicio';
import { Types } from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const servicios = await Servicio.find();
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error en GET /api/servicios:', error);
    return NextResponse.json({ message: 'Error al obtener servicios' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const nuevoServicio = await Servicio.create({
      titulo: body.titulo,
      descripcion: body.descripcion,
      precio: Number(body.precio),
      categoria: body.categoria,
      disponibilidad: body.disponibilidad,
      trabajadorId: body.trabajadorId
    });

    return NextResponse.json(nuevoServicio);
  } catch (error) {
    console.error('Error en POST /api/servicios:', error);
    return NextResponse.json({ error: 'Error al guardar servicio' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validar ID
    if (!body._id || !Types.ObjectId.isValid(body._id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const servicioActualizado = await Servicio.findByIdAndUpdate(
      body._id,
      {
        titulo: body.titulo,
        descripcion: body.descripcion,
        precio: Number(body.precio),
        categoria: body.categoria,
        disponibilidad: body.disponibilidad
      },
      { new: true }
    );

    if (!servicioActualizado) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(servicioActualizado);
  } catch (error) {
    console.error('Error en PUT /api/servicios:', error);
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}
