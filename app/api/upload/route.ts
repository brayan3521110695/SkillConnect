// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/authOptions';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function getUserId(req: Request) {
  // 1) Sesión NextAuth (DB o JWT)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = (session.user as any).id ?? (session as any).user?.sub;
    if (id) return String(id);
  }
  // 2) JWT NextAuth (strategy: 'jwt')
  const jwt = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  if (jwt) {
    const id = (jwt as any).id ?? jwt.sub;
    if (id) return String(id);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('imagen') as File | null;
    // Fallback: si mandas usuarioId en el form, se usa. Si no, toma de sesión.
    const usuarioIdForm = (formData.get('usuarioId') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'Imagen requerida' }, { status: 400 });
    }

    // Autenticación (si no hay usuarioId en form debe haber sesión)
    let userId = usuarioIdForm;
    if (!userId) {
      userId = await getUserId(req);
      if (!userId) {
        return NextResponse.json({ error: 'No autorizado (sesión ausente)' }, { status: 401 });
      }
    }

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Cloudinary con upload_stream
    const result: { secure_url: string } = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `usuarios/${userId}`, resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ secure_url: result.secure_url });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error: any) {
    console.error('❌ Error en subida de imagen:', error?.message || error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
