import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import connectDB from '@/lib/dbConnect';
import Conversacion from '@/models/conversacion';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const conversaciones = await Conversacion.find({
      participantes: { $in: [userId] },
    }).sort({ creadoEn: -1 });

    const conversacionesConDetalles = await Promise.all(
      conversaciones.map(async (conv) => {
        const participantesDetallados = await conv.getParticipantes();
        return {
          _id: conv._id,
          creadoEn: conv.creadoEn,
          participantes: participantesDetallados,
        };
      })
    );

    return NextResponse.json(conversacionesConDetalles);
  } catch (error: any) {
    console.error('❌ Error al obtener conversaciones:', error.message);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { clienteId, trabajadorId, mensajeInicial } = await req.json();

    // Validaciones para evitar crear conversaciones vacías
    if (!clienteId || !trabajadorId) {
      return NextResponse.json(
        { error: 'Faltan participantes' },
        { status: 400 }
      );
    }

    if (!mensajeInicial || mensajeInicial.trim() === '') {
      return NextResponse.json(
        { error: 'El mensaje inicial no puede estar vacío' },
        { status: 400 }
      );
    }

    const clienteObjectId = new mongoose.Types.ObjectId(clienteId);
    const trabajadorObjectId = new mongoose.Types.ObjectId(trabajadorId);

    const existente = await Conversacion.findOne({
      participantes: {
        $all: [clienteObjectId, trabajadorObjectId],
      },
      $expr: { $eq: [{ $size: '$participantes' }, 2] },
    });

    if (existente) {
      const participantesDetallados = await existente.getParticipantes();
      return NextResponse.json({
        _id: existente._id,
        creadoEn: existente.creadoEn,
        participantes: participantesDetallados,
      });
    }

    // Crear conversación nueva con mensaje inicial
    const nuevaConversacion = await Conversacion.create({
      participantes: [clienteObjectId, trabajadorObjectId],
      participantesModel: ['Cliente', 'Trabajador'],
      mensajes: [
        {
          texto: mensajeInicial,
          emisor: clienteObjectId,
          creadoEn: new Date()
        }
      ],
      creadoEn: new Date()
    });

    const participantesDetallados = await nuevaConversacion.getParticipantes();

    return NextResponse.json({
      _id: nuevaConversacion._id,
      creadoEn: nuevaConversacion.creadoEn,
      participantes: participantesDetallados,
    });
  } catch (error) {
    console.error('❌ Error al crear conversación:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
