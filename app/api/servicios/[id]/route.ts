// app/api/servicios/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Servicio from '@/models/servicio';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const actualizado = await Servicio.findByIdAndUpdate(
      id,
      {
        titulo: body.titulo,
        descripcion: body.descripcion,
        precio: body.precio,
        categoria: body.categoria,
        disponibilidad: body.disponibilidad,
        trabajadorId: body.trabajadorId
      },
      { new: true }
    );

    if (!actualizado) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error en PUT /api/servicios/[id]:', error);
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    const eliminado = await Servicio.findByIdAndDelete(id);

    if (!eliminado) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /api/servicios/[id]:', error);
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}
