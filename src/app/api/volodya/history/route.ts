// Rundex CRM - API для получения истории чатов с Володей
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cacheService, CACHE_KEYS, CACHE_TTL } from "@/lib/cache/cache-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50) // Максимум 50 чатов
    const offset = parseInt(searchParams.get("offset") || "0")

    // Получение сессий чатов пользователя (с кешированием)
    const cacheKey = `chat_history:${session.user!.email}:${limit}:${offset}`
    const chatSessions = await cacheService.getOrSet(
      cacheKey,
      async () => await (prisma as any).chatSession.findMany({
      where: {
        userId: session.user!.email
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 5 // Последние 5 сообщений для превью
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
      }),
      CACHE_TTL.lists
    )

    // Форматирование данных для frontend
    const formattedSessions = chatSessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session._count.messages,
      preview: session.messages.length > 0 ? {
        lastMessage: session.messages[session.messages.length - 1].content.substring(0, 100),
        lastMessageTime: session.messages[session.messages.length - 1].createdAt
      } : null,
      recentMessages: session.messages.slice(-3).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content.substring(0, 200),
        createdAt: msg.createdAt,
        confidence: msg.confidence,
        source: msg.source
      }))
    }))

    return NextResponse.json({
      sessions: formattedSessions,
      total: await cacheService.getOrSet(
        `chat_count:${session.user!.email}`,
        async () => await (prisma as any).chatSession.count({
          where: { userId: session.user!.email }
        }),
        CACHE_TTL.api
      ),
      hasMore: chatSessions.length === limit
    })

  } catch (error) {
    console.error("Ошибка при получении истории чатов:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при получении истории чатов" },
      { status: 500 }
    )
  }
}

// Получение конкретной сессии чата
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "ID сессии обязателен" }, { status: 400 })
    }

    // Получение полной сессии чата
    const chatSession = await (prisma as any).chatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user!.email
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: "Сессия не найдена" }, { status: 404 })
    }

    // Форматирование сообщений
    const formattedMessages = chatSession.messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      confidence: msg.confidence,
      source: msg.source,
      data: msg.data ? JSON.parse(msg.data) : null,
      timestamp: msg.createdAt
    }))

    return NextResponse.json({
      session: {
        id: chatSession.id,
        title: chatSession.title,
        createdAt: chatSession.createdAt,
        updatedAt: chatSession.updatedAt
      },
      messages: formattedMessages
    })

  } catch (error) {
    console.error("Ошибка при получении сессии чата:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при получении сессии чата" },
      { status: 500 }
    )
  }
}
