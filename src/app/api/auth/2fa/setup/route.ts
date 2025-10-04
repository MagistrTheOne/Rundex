// Rundex CRM - API настройки 2FA
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { twoFactorService } from "@/lib/auth/2fa/two-factor-service"

// POST /api/auth/2fa/setup - Настройка 2FA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { method } = body // 'totp' или 'sms'

    if (!method || !['totp', 'sms'].includes(method)) {
      return NextResponse.json(
        { error: "Неверный метод 2FA" },
        { status: 400 }
      )
    }

    // Получаем пользователя
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, twoFactorEnabled: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "2FA уже включено для этого аккаунта" },
        { status: 400 }
      )
    }

    let setupData: any = {}

    if (method === 'totp') {
      // Генерируем секрет и QR-код для TOTP
      const totpSetup = await twoFactorService.generateTOTPSecret(user.email!)
      setupData = {
        method: 'totp',
        secret: totpSetup.secret,
        qrCodeUrl: totpSetup.qrCodeUrl,
        backupCodes: totpSetup.backupCodes
      }
    } else if (method === 'sms') {
      // Для SMS 2FA потребуется дополнительная настройка номера телефона
      // Пока возвращаем заглушку
      return NextResponse.json(
        { error: "SMS 2FA пока не реализован" },
        { status: 501 }
      )
    }

    return NextResponse.json({
      message: "2FA настроено",
      setup: setupData
    })

  } catch (error) {
    console.error("Ошибка настройки 2FA:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/auth/2fa/setup - Включение 2FA после настройки
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { method, secret, backupCodes, verificationCode } = body

    if (!method || !secret || !backupCodes || !verificationCode) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
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

    // Проверяем verification code
    if (method === 'totp') {
      const isValid = await twoFactorService.verifyTOTPCode(secret, verificationCode)
      if (!isValid) {
        return NextResponse.json(
          { error: "Неверный код подтверждения" },
          { status: 400 }
        )
      }
    }

    // Включаем 2FA
    await twoFactorService.enable2FAForUser(user.id, method, secret, backupCodes)

    return NextResponse.json({
      message: "2FA успешно включено",
      backupCodes: backupCodes // Показываем коды только один раз
    })

  } catch (error) {
    console.error("Ошибка включения 2FA:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
