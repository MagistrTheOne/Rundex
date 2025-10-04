// Rundex CRM - Главная страница
// Автор: MagistrTheOne, 2025

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, Sparkles } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="glass-card rounded-lg p-8 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Rundex CRM</h1>
        <p className="text-white/70 mb-6">
          Профессиональная система управления отношениями с клиентами
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-white/70" />
          <span className="text-white/70">Загрузка...</span>
        </div>
        <div className="mt-6 text-xs text-white/50">
          Разработано MagistrTheOne © 2025
        </div>
      </div>
    </div>
  )
}
