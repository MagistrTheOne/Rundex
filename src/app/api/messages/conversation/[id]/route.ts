// Rundex CRM - API получения сообщений беседы
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/messages/conversation/[id] - Получить сообщения беседы
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const conversationId = params.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем, что пользователь участвует в беседе
    const participant = await prisma.user.findUnique({
      where: { id: conversationId },
      select: { id: true, name: true, email: true, avatar: true }
    })

    if (!participant) {
      return NextResponse.json({ error: "Участник беседы не найден" }, { status: 404 })
    }

    // Получаем сообщения беседы
    const messages = await (prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: user.id, recipientId: conversationId },
          { senderId: conversationId, recipientId: user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    })

    // Отмечаем полученные сообщения как прочитанные
    await (prisma as any).message.updateMany({
      where: {
        senderId: conversationId,
        recipientId: user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    // Форматируем сообщения для фронтенда
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      type: message.type,
      sender: message.sender,
      timestamp: message.createdAt,
      isRead: message.isRead,
      readAt: message.readAt
    }))

    // Получаем информацию о беседе
    const conversationInfo = {
      id: conversationId,
      participants: [participant],
      type: 'direct' as const
    }

    return NextResponse.json({
      conversation: conversationInfo,
      messages: formattedMessages,
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit
      }
    })
  } catch (error) {
    console.error("Ошибка при получении сообщений беседы:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
