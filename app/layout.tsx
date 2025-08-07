// app/layout.tsx
'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Inter } from 'next/font/google';
import { SessionProvider } from "next-auth/react"; // ⬅️ importante

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-gray-50">
        <SessionProvider> {/* ⬅️ Esto permite usar useSession() en TODA la app */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
