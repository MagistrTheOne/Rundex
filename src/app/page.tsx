// Rundex CRM - Корпоративный лендинг (главная страница)
// Автор: MagistrTheOne, 2025

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LandingPage } from "@/components/landing/landing-page"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Если пользователь авторизован, перенаправляем в дашборд
  if (session) {
    redirect("/dashboard")
  }

  // Для неавторизованных пользователей показываем лендинг
  return <LandingPage />
}
