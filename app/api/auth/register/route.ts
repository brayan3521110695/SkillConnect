import connectDB from '@/lib/dbConnect';
import Cliente from '@/models/cliente';
import Trabajador from '@/models/trabajador';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

interface RegisterBody {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  tipo: 'cliente' | 'trabajador';
  especialidad?: string;
}

export async function POST(req: Request) {
  console.log('📥 Llamada recibida en /api/auth/register');

  try {
    const { email, password, nombre, apellidos, tipo, especialidad }: RegisterBody = await req.json();
    await connectDB();

    // Validar campos requeridos
    if (!email || !password || !nombre || !apellidos || !tipo) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Validar tipo
    if (tipo !== 'cliente' && tipo !== 'trabajador') {
      return NextResponse.json({ error: 'Tipo de usuario no válido' }, { status: 400 });
    }

    const Modelo = tipo === 'trabajador' ? Trabajador : Cliente;

    const existente = await Modelo.findOne({ email: email.toLowerCase() });
    if (existente) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuarioData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      nombre,
      apellidos,
      ...(tipo === 'trabajador' && { especialidad: especialidad || 'general' })
    };

    const nuevoUsuario = await Modelo.create(nuevoUsuarioData);

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error('❌ Error en el registro:', error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
