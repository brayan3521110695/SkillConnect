import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Mensaje from '@/models/mensaje';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await connectDB();

    // Validar que el cuerpo sea JSON válido
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud no es JSON válido' },
        { status: 400 }
      );
    }

    const { conversacionId, contenido, de, tipoUsuario } = body;

    // Validar contenido
    if (!contenido || contenido.trim() === '') {
      return NextResponse.json(
        { error: 'El contenido del mensaje está vacío' },
        { status: 400 }
      );
    }

    // Validar IDs
    if (
      !mongoose.Types.ObjectId.isValid(conversacionId) ||
      !mongoose.Types.ObjectId.isValid(de)
    ) {
      return NextResponse.json(
        { error: 'ID inválido de conversación o usuario' },
        { status: 400 }
      );
    }

    // Validar tipo de usuario
    const tipoUsuarioNormalizado =
      tipoUsuario?.toLowerCase() === 'cliente'
        ? 'Cliente'
        : tipoUsuario?.toLowerCase() === 'trabajador'
        ? 'Trabajador'
        : null;

    if (!tipoUsuarioNormalizado) {
      return NextResponse.json(
        { error: 'Tipo de usuario inválido' },
        { status: 400 }
      );
    }

    // Crear nuevo mensaje
    const nuevoMensaje = await Mensaje.create({
      conversacion: new mongoose.Types.ObjectId(conversacionId),
      contenido: contenido.trim(),
      de: new mongoose.Types.ObjectId(de),
      tipoUsuario: tipoUsuarioNormalizado,
      creadoEn: new Date(),
    });

    // Popular info del remitente
    const mensajeCompleto = await nuevoMensaje.populate('de');

    return NextResponse.json(mensajeCompleto);
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url || '');
    const conversacionId = url.searchParams.get('conversacionId');

    if (!conversacionId || !mongoose.Types.ObjectId.isValid(conversacionId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido o no enviado' },
        { status: 400 }
      );
    }

    const mensajes = await Mensaje.find({ conversacion: conversacionId })
      .populate('de')
      .sort({ creadoEn: 1 });

    return NextResponse.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}
