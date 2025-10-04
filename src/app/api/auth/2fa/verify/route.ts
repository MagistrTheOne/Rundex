// Rundex CRM - API верификации 2FA
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { twoFactorService } from "@/lib/auth/2fa/two-factor-service"

// POST /api/auth/2fa/verify - Верификация 2FA кода
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: "Код обязателен" },
        { status: 400 }
      )
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

    // Проверяем 2FA код
    const verification = await twoFactorService.verify2FAForLogin(user.id, code)

    if (!verification.isValid) {
      return NextResponse.json(
        { error: "Неверный код 2FA" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "2FA успешно верифицировано",
      backupCodeUsed: verification.backupCodeUsed || false
    })

  } catch (error) {
    console.error("Ошибка верификации 2FA:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/auth/2fa/backup-codes - Регенерация резервных кодов
export async function PUT(request: NextRequest) {
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

    // Регенерируем резервные коды
    const newBackupCodes = await twoFactorService.regenerateBackupCodes(user.id)

    return NextResponse.json({
      message: "Резервные коды обновлены",
      backupCodes: newBackupCodes
    })

  } catch (error) {
    console.error("Ошибка регенерации резервных кодов:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
