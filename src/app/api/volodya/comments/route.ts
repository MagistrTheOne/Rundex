// Rundex CRM - API для получения саркастичных комментариев Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { ContextManager } from "@/lib/volodya/contextManager"

export async function GET() {
  try {
    // Получаем комментарии из разных контекстов
    const sarcasticComments = ContextManager.getContext('sarcastic-comments')
    const systemNotifications = ContextManager.getContext('system-notifications')

    // Комбинируем все комментарии
    const allComments = [
      ...sarcasticComments,
      ...systemNotifications
    ].sort((a, b) => b.timestamp - a.timestamp) // Сортировка по времени (новые сверху)

    return NextResponse.json({
      comments: allComments,
      total: allComments.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments', comments: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'clear') {
      // Очищаем комментарии
      ContextManager.clearContext('sarcastic-comments')
      ContextManager.clearContext('system-notifications')

      return NextResponse.json({
        success: true,
        message: 'Комментарии очищены',
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'add_test_comment') {
      // Добавляем тестовый комментарий для демонстрации
      ContextManager.addMessage('sarcastic-comments', {
        role: 'assistant',
        content: '😏 Ого, вы тут решили поработать? Или просто случайно клавиатуру зацепили?'
      })

      ContextManager.addMessage('system-notifications', {
        role: 'assistant',
        content: '🚨 Критическое изменение: обнаружено подозрительное движение мыши. Требуется подтверждение адекватности!'
      })

      return NextResponse.json({
        success: true,
        message: 'Тестовый комментарий добавлен',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
