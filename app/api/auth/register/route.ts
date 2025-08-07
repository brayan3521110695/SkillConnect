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
    const {
      email,
      password,
      nombre,
      apellidos,
      tipo,
      especialidad
    }: RegisterBody = await req.json();

    await connectDB();

    // Validar que todos los campos requeridos estén presentes y no vacíos
    if (
      !email?.trim() ||
      !password?.trim() ||
      !nombre?.trim() ||
      !apellidos?.trim() ||
      !tipo?.trim()
    ) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (tipo !== 'cliente' && tipo !== 'trabajador') {
      return NextResponse.json({ error: 'Tipo de usuario no válido' }, { status: 400 });
    }

    if (tipo === 'trabajador' && !especialidad?.trim()) {
      return NextResponse.json({ error: 'Falta la especialidad del trabajador' }, { status: 400 });
    }

    const normalizadoEmail = email.trim().toLowerCase();
    const normalizadoNombre = nombre.trim();
    const normalizadoApellidos = apellidos.trim();

    const Modelo = tipo === 'trabajador' ? Trabajador : Cliente;

    const existente = await Modelo.findOne({ email: normalizadoEmail });
    if (existente) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const nuevoUsuarioData = {
      email: normalizadoEmail,
      password: hashedPassword,
      nombre: normalizadoNombre,
      apellidos: normalizadoApellidos,
...(tipo === 'trabajador' ? { especialidad: especialidad?.trim() || 'general' } : {}),
      rol: tipo,
    };

    const nuevoUsuario = await Modelo.create(nuevoUsuarioData);

    return NextResponse.json({
      mensaje: 'Registro exitoso',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: tipo,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error en el registro:', error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
