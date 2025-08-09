// app/api/auth/userinfo/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/dbConnect";
import Cliente from "@/models/cliente";
import Trabajador from "@/models/trabajador";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();

  let usuario: any = null;
  if (token.rol === "cliente") {
    usuario = await Cliente.findById(token.id).lean();
  } else if (token.rol === "trabajador") {
    usuario = await Trabajador.findById(token.id).lean();
  }

  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre ?? "",
      email: usuario.email ?? "",
      rol: token.rol,
      foto: usuario.foto ?? "/images/user.jpg",
    },
  });
}
