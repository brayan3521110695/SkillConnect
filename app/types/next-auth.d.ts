// types/next-auth.d.ts

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nombre: string;
      email: string;
      rol: "cliente" | "trabajador";
    };
  }

  interface User {
    id: string;
    nombre: string;
    email: string;
    rol: "cliente" | "trabajador";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nombre: string;
    email: string;
    rol: "cliente" | "trabajador";
  }
}
