// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/dbConnect";
import Cliente from "@/models/cliente";
import Trabajador from "@/models/trabajador";

interface CustomUser {
  id: string;
  nombre: string;
  email: string;
  rol: "cliente" | "trabajador";
  foto?: string;
}

interface CustomToken {
  id?: string;
  nombre?: string;
  email?: string;
  rol?: "cliente" | "trabajador";
  foto?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        await connectDB();

        const correo = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!correo || !password) return null;

        // 1) Buscar como Cliente
        const cliente = await Cliente.findOne({ email: correo });
        if (cliente) {
          const valid = await bcrypt.compare(password, cliente.password);
          if (valid) {
            return {
              id: cliente._id.toString(),
              nombre: cliente.nombre,
              email: cliente.email,
              rol: "cliente",
              foto: cliente.foto || "/images/user.jpg",
            };
          }
        }

        // 2) Buscar como Trabajador
        const trabajador = await Trabajador.findOne({ email: correo });
        if (trabajador) {
          const valid = await bcrypt.compare(password, trabajador.password);
          if (valid) {
            return {
              id: trabajador._id.toString(),
              nombre: trabajador.nombre,
              email: trabajador.email,
              rol: "trabajador",
              foto: trabajador.foto || "/images/user.jpg",
            };
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    // Guarda datos en el JWT al iniciar sesión y permite actualizarlos con update()
    async jwt({ token, user, trigger, session }) {
      // Login: copiar del usuario al token
      if (user) {
        const u = user as CustomUser;
        token.id = u.id;
        token.nombre = u.nombre;
        token.email = u.email;
        token.rol = u.rol;
        token.foto = u.foto;
      }

      // update(): permite refrescar campos sin re-login
      if (trigger === "update" && session) {
        const s = session as Partial<CustomToken>;
        if (typeof s.foto === "string") token.foto = s.foto;
        if (typeof s.nombre === "string") token.nombre = s.nombre;
        if (typeof s.email === "string") token.email = s.email;
        // (Si alguna vez quieres permitir cambiar rol vía update, hazlo aquí)
      }

      return token;
    },

    // Pasa los datos del token a la sesión (lo que usa el frontend)
    async session({ session, token }) {
      const t = token as CustomToken;
      session.user = {
        ...session.user,
        id: t.id!,
        nombre: t.nombre || session.user?.name || "Usuario",
        email: t.email || "",
        rol: (t.rol as "cliente" | "trabajador") || "cliente",
        foto: t.foto || "/images/user.jpg",
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },
};
