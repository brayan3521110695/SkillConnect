import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Cliente from "@/models/cliente";
import Trabajador from "@/models/trabajador";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";

interface CustomUser {
  id: string;
  nombre: string;
  email: string;
  rol: "cliente" | "trabajador";
}

interface CustomToken {
  id?: string;
  nombre?: string;
  email?: string;
  rol?: string;
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

        console.log("📩 Intentando login con:", correo);
        console.log("🔐 Password ingresado:", password);

        if (!correo || !password) {
          console.log("⚠️ Faltan credenciales");
          return null;
        }

        // Buscar primero en Clientes
        const cliente = await Cliente.findOne({ email: correo });
        if (cliente) {
          console.log("👤 Cliente encontrado:", cliente.email);
          const valid = await bcrypt.compare(password, cliente.password);
          console.log("🔑 ¿Password válida para cliente?", valid);
          if (valid) {
            console.log("✅ Login exitoso como cliente");
            return {
              id: cliente._id.toString(),
              nombre: cliente.nombre,
              email: cliente.email,
              rol: "cliente",
            };
          } else {
            console.log("❌ Contraseña incorrecta para cliente");
          }
        } else {
          console.log("❌ No se encontró cliente con ese correo");
        }

        // Buscar en Trabajadores
        const trabajador = await Trabajador.findOne({ email: correo });
        if (trabajador) {
          console.log("👷 Trabajador encontrado:", trabajador.email);
          const valid = await bcrypt.compare(password, trabajador.password);
          console.log("🔑 ¿Password válida para trabajador?", valid);
          if (valid) {
            console.log("✅ Login exitoso como trabajador");
            return {
              id: trabajador._id.toString(),
              nombre: trabajador.nombre,
              email: trabajador.email,
              rol: "trabajador",
            };
          } else {
            console.log("❌ Contraseña incorrecta para trabajador");
          }
        } else {
          console.log("❌ No se encontró trabajador con ese correo");
        }

        console.log("🚫 Autenticación fallida. Usuario no válido.");
        return null;
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as CustomUser;
        token.id = u.id;
        token.nombre = u.nombre;
        token.email = u.email;
        token.rol = u.rol;
      }
      return token;
    },

    async session({ session, token }) {
      const t = token as CustomToken;

      session.user = {
        ...session.user,
        id: t.id!,
        nombre: t.nombre!,
        email: t.email!,
        rol: t.rol as "cliente" | "trabajador",
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
