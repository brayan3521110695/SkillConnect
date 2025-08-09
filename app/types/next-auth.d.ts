// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nombre: string;
      email: string;
      rol: "cliente" | "trabajador";
      foto?: string; // <- importante
    } & DefaultSession["user"]; // conserva name/image si las usas
  }

  interface User {
    id: string;
    nombre: string;
    email: string;
    rol: "cliente" | "trabajador";
    foto?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    nombre?: string;
    email?: string;
    rol?: "cliente" | "trabajador";
    foto?: string; // <- importante y opcional
  }
}
