// Rundex CRM - Главный layout
// Автор: MagistrTheOne, 2025

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rundex CRM - Система управления отношениями с клиентами",
  description: "Профессиональная CRM-система для российского бизнеса с AI-ассистентом 'Володя'",
  authors: [{ name: "MagistrTheOne" }],
  keywords: ["CRM", "управление клиентами", "продажи", "бизнес", "Россия"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
