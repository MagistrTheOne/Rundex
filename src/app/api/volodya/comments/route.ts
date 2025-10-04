// Rundex CRM - API для получения саркастичных комментариев Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Возвращаем моковые комментарии для демонстрации
    // В реальном приложении здесь будут реальные данные из ContextManager
    const mockComments = [
      {
        role: 'assistant',
        content: '😏 Ого, вы тут решили поработать? Или просто случайно клавиатуру зацепили?',
        timestamp: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        role: 'assistant',
        content: '🚨 Критическое изменение: обнаружено подозрительное движение мыши. Требуется подтверждение адекватности!',
        timestamp: Date.now() - 1 * 60 * 60 * 1000
      }
    ]

    return NextResponse.json({
      comments: mockComments,
      total: mockComments.length,
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
      // Очищаем комментарии (моковая реализация)
      console.log('Комментарии очищены (мок)')

      return NextResponse.json({
        success: true,
        message: 'Комментарии очищены',
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'add_test_comment') {
      // Добавляем тестовый комментарий для демонстрации (моковая реализация)
      console.log('Тестовый комментарий добавлен (мок)')

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
