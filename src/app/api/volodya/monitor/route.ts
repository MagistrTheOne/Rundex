// Rundex CRM - API для тестирования системы мониторинга Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Возвращаем моковые данные для демонстрации
    // В реальном приложении здесь будут реальные данные из мониторинга
    const mockStats = {
      totalChanges: 5,
      last24hChanges: 5,
      lastHourChanges: 3,
      criticalIssues: 1,
      changeTypes: {
        lead_updated: 3,
        task_created: 1,
        deal_updated: 1
      }
    }

    const mockReport = {
      period: {
        start: Date.now() - 24 * 60 * 60 * 1000,
        end: Date.now()
      },
      changes: [
        {
          type: 'lead_updated',
          entityId: 'entity-1',
          description: 'Обновлен лид клиента',
          severity: 'medium',
          timestamp: Date.now() - 2 * 60 * 60 * 1000
        }
      ],
      summary: {
        totalChanges: 5,
        criticalIssues: 1,
        recommendations: [
          'Обнаружено 1 критических проблем требующих внимания.',
          'Пик активности приходится на вечерние часы.'
        ],
        sarcasticComments: [
          'Критические проблемы множатся быстрее кроликов. Может пора что-то предпринять?'
        ]
      },
      insights: {
        productivityScore: 85,
        riskLevel: 'low',
        opportunities: [
          'Команда показывает хорошую продуктивность',
          'Рекомендуется оптимизировать процесс обработки лидов'
        ]
      }
    }

    return NextResponse.json({
      stats: mockStats,
      report: mockReport,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting monitoring data:', error)
    return NextResponse.json(
      { error: 'Failed to get monitoring data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'simulate_changes':
        // Симулируем случайные изменения в CRM (моковая реализация)
        console.log('Симуляция изменений выполнена (мок)')
        return NextResponse.json({
          success: true,
          message: 'Симуляция изменений выполнена',
          timestamp: new Date().toISOString()
        })

      case 'generate_report':
        // Генерируем отчет мониторинга (моковая реализация)
        const mockReport = {
          period: {
            start: Date.now() - 60 * 60 * 1000,
            end: Date.now()
          },
          changes: [
            {
              type: 'lead_updated',
              entityId: 'entity-1',
              description: 'Обновлен лид клиента',
              severity: 'medium',
              timestamp: Date.now() - 30 * 60 * 1000
            }
          ],
          summary: {
            totalChanges: 3,
            criticalIssues: 0,
            recommendations: [
              'Команда показывает хорошую продуктивность',
              'Рекомендуется оптимизировать процесс обработки лидов'
            ],
            sarcasticComments: [
              'Неплохо поработали сегодня!'
            ]
          },
          insights: {
            productivityScore: 88,
            riskLevel: 'low',
            opportunities: [
              'Рассмотрите расширение отдела продаж',
              'Внедрите автоматизацию рутинных задач'
            ]
          }
        }

        return NextResponse.json({
          success: true,
          report: mockReport,
          timestamp: new Date().toISOString()
        })

      case 'clear_context':
        // Очищаем контекст саркастичных комментариев (моковая реализация)
        console.log('Контекст очищен (мок)')
        return NextResponse.json({
          success: true,
          message: 'Контекст очищен',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in monitoring API:', error)
    return NextResponse.json(
      { error: 'Failed to process monitoring action' },
      { status: 500 }
    )
  }
}
