// Rundex CRM - API подписки на push-уведомления
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/push/subscribe - Подписка на push-уведомления
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { subscription, userId } = body

    if (!subscription) {
      return NextResponse.json(
        { error: "Данные подписки обязательны" },
        { status: 400 }
      )
    }

    // В реальном приложении здесь нужно сохранить подписку в базе данных
    // Для демонстрации просто логируем и возвращаем успех

    console.log('Push subscription received:', {
      userId: userId || session.user.email,
      endpoint: subscription.endpoint,
      keys: subscription.keys
    })

    // Имитация сохранения подписки
    // В продакшене здесь должен быть код сохранения в БД

    return NextResponse.json({
      success: true,
      message: "Подписка на push-уведомления активирована"
    })
  } catch (error) {
    console.error("Ошибка при подписке на push:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
