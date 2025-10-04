// Rundex CRM - API получения бесед
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/messages/conversations - Получить список бесед пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Получаем все уникальные беседы пользователя (как отправителя или получателя)
    const sentMessages = await (prisma as any).message.findMany({
      where: { senderId: user.id },
      select: {
        recipientId: true,
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      distinct: ['recipientId']
    })

    const receivedMessages = await (prisma as any).message.findMany({
      where: { recipientId: user.id },
      select: {
        senderId: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      distinct: ['senderId']
    })

    // Объединяем и удаляем дубликаты
    const conversationsMap = new Map()

    // Добавляем отправленные сообщения
    sentMessages.forEach(msg => {
      if (msg.recipient) {
        conversationsMap.set(msg.recipient.id, {
          id: msg.recipient.id,
          name: msg.recipient.name,
          email: msg.recipient.email,
          avatar: msg.recipient.avatar,
          type: 'direct'
        })
      }
    })

    // Добавляем полученные сообщения
    receivedMessages.forEach(msg => {
      if (msg.sender) {
        conversationsMap.set(msg.sender.id, {
          id: msg.sender.id,
          name: msg.sender.name,
          email: msg.sender.email,
          avatar: msg.sender.avatar,
          type: 'direct'
        })
      }
    })

    // Получаем последнее сообщение и количество непрочитанных для каждой беседы
    const conversations = await Promise.all(
      Array.from(conversationsMap.values()).map(async (contact) => {
        // Последнее сообщение в беседе
        const lastMessage = await (prisma as any).message.findFirst({
          where: {
            OR: [
              { senderId: user.id, recipientId: contact.id },
              { senderId: contact.id, recipientId: user.id }
            ]
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { id: true, name: true, email: true }
            }
          }
        })

        // Количество непрочитанных сообщений
        const unreadCount = await (prisma as any).message.count({
          where: {
            senderId: contact.id,
            recipientId: user.id,
            isRead: false
          }
        })

        // Определяем онлайн статус (простая логика - был активен в последние 5 минут)
        const recentActivity = await prisma.activity.findFirst({
          where: {
            userId: contact.id,
            createdAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // 5 минут
            }
          }
        })

        return {
          id: contact.id,
          participants: [contact],
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            timestamp: lastMessage.createdAt,
            sender: lastMessage.sender
          } : null,
          unreadCount,
          isOnline: !!recentActivity,
          type: 'direct' as const
        }
      })
    )

    // Сортируем по времени последнего сообщения
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || new Date(0)
      const bTime = b.lastMessage?.timestamp || new Date(0)
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Ошибка при получении бесед:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
