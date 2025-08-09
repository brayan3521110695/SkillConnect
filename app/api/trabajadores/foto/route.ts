import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import dbConnect from '@/lib/dbConnect';
import Trabajador from '@/models/trabajador';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('foto') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
    }
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Formato no válido' }, { status: 400 });
    }

    // Guardar en /public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safe = (file.name || 'foto').replace(/\s+/g, '-');
    const filename = `${Date.now()}-${safe}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;

    // Actualizar trabajador
    await dbConnect();
    await Trabajador.findOneAndUpdate(
      { email: session.user.email },
      { foto: url },
      { new: true }
    );

    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al subir/guardar imagen' }, { status: 500 });
  }
}
