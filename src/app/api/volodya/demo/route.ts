// Rundex CRM - API для демо-интерфейса Володи с Sber GigaChat
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { SberAdapter, VolodyaMessage } from "@/lib/volodya/sberAdapter"
import { ContextManager } from "@/lib/volodya/contextManager"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = 'default' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Сообщение обязательно" }, { status: 400 })
    }

    // Имитация обработки запроса для UX
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // Получаем контекст предыдущих сообщений
    const context = ContextManager.getContext(sessionId)

    // Добавляем текущее сообщение пользователя в контекст
    ContextManager.addMessage(sessionId, {
      role: 'user',
      content: message
    })

    // Получаем ответ от Володи через адаптер
    const volodyaResponse = await SberAdapter.getVolodyaResponse(message, context)

    // Добавляем ответ Володи в контекст
    ContextManager.addMessage(sessionId, {
      role: 'assistant',
      content: volodyaResponse.response
    })

    return NextResponse.json({
      response: volodyaResponse.response,
      source: volodyaResponse.source,
      confidence: volodyaResponse.confidence,
      tokens: volodyaResponse.tokens,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Ошибка в демо Володи:", error)

    // В случае ошибки возвращаем fallback ответ
    const fallbackResponse = SberAdapter.createFallbackResponse("Ошибка системы")

    return NextResponse.json({
      response: fallbackResponse.response,
      source: 'error',
      confidence: 0,
      tokens: 0,
      timestamp: new Date().toISOString(),
      error: "Произошла ошибка при обработке запроса"
    }, { status: 500 })
  }
}

// GET endpoint для проверки статуса GigaChat
export async function GET() {
  try {
    const isAvailable = await SberAdapter.checkAvailability()
    const stats = ContextManager.getStats()

    return NextResponse.json({
      status: isAvailable ? 'online' : 'offline',
      available: isAvailable,
      contextStats: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Ошибка при проверке статуса:", error)
    return NextResponse.json({
      status: 'error',
      available: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
