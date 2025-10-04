// Rundex CRM - API отправки сообщений
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/messages/send - Отправить сообщение
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { recipientId, content, type = "TEXT" } = body

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Получатель и содержание сообщения обязательны" },
        { status: 400 }
      )
    }

    // Получаем отправителя
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    })

    if (!sender) {
      return NextResponse.json({ error: "Отправитель не найден" }, { status: 404 })
    }

    // Проверяем, существует ли получатель
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, name: true, email: true }
    })

    if (!recipient) {
      return NextResponse.json({ error: "Получатель не найден" }, { status: 404 })
    }

    // Создаем сообщение
    const message = await (prisma as any).message.create({
      data: {
        content,
        type: type as any,
        senderId: sender.id,
        recipientId: recipient.id,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Создаем активность для отправителя
    await prisma.activity.create({
      data: {
        type: "MESSAGE_SENT" as any,
        subject: `Сообщение пользователю ${recipient.name || recipient.email}`,
        description: `Отправлено сообщение пользователю ${recipient.name || recipient.email}`,
        userId: sender.id
      }
    })

    return NextResponse.json({
      id: message.id,
      content: message.content,
      type: message.type,
      sender: message.sender,
      recipient: message.recipient,
      timestamp: message.createdAt,
      isRead: message.isRead
    }, { status: 201 })
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
