import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Obtener el token desde la cookie
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar y decodificar el token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Retornar en el formato esperado por el frontend
    return NextResponse.json({
      usuario: {
        nombre: decoded.nombre,
        email: decoded.email
      }
    });

  } catch (error) {
    console.error('❌ Error al verificar token:', error);
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
  }
}
