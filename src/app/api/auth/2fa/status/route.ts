// Rundex CRM - API статуса 2FA
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { twoFactorService } from "@/lib/auth/2fa/two-factor-service"

// GET /api/auth/2fa/status - Получение статуса 2FA
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Получаем пользователя
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    const status = await twoFactorService.getUser2FAStatus(user.id)

    return NextResponse.json(status)

  } catch (error) {
    console.error("Ошибка получения статуса 2FA:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/2fa/status - Отключение 2FA
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { verificationCode } = body

    // Получаем пользователя
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, twoFactorSecret: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем код перед отключением
    if (user.twoFactorSecret && verificationCode) {
      const isValid = await twoFactorService.verifyTOTPCode(user.twoFactorSecret, verificationCode)
      if (!isValid) {
        return NextResponse.json(
          { error: "Неверный код подтверждения" },
          { status: 400 }
        )
      }
    }

    // Отключаем 2FA
    await twoFactorService.disable2FAForUser(user.id)

    return NextResponse.json({
      message: "2FA успешно отключено"
    })

  } catch (error) {
    console.error("Ошибка отключения 2FA:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
