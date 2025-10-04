// Rundex CRM - API отписки от push-уведомлений
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/push/unsubscribe - Отписка от push-уведомлений
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { endpoint, userId } = body

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint подписки обязателен" },
        { status: 400 }
      )
    }

    // В реальном приложении здесь нужно удалить подписку из базы данных
    // Для демонстрации просто логируем

    console.log('Push unsubscription received:', {
      userId: userId || session.user.email,
      endpoint: endpoint
    })

    // Имитация удаления подписки
    // В продакшене здесь должен быть код удаления из БД

    return NextResponse.json({
      success: true,
      message: "Подписка на push-уведомления деактивирована"
    })
  } catch (error) {
    console.error("Ошибка при отписке от push:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
