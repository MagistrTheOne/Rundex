// Rundex CRM - API для тестирования системы мониторинга Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import crmMonitor from "@/lib/volodya/crm-monitor"
import { ContextManager } from "@/lib/volodya/contextManager"

export async function GET() {
  try {
    // Получаем статистику мониторинга
    const stats = crmMonitor.getStats()
    const monitoringReport = await crmMonitor.generateReport(24)

    return NextResponse.json({
      stats,
      report: monitoringReport,
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
        // Симулируем случайные изменения в CRM
        crmMonitor.simulateChanges()
        return NextResponse.json({
          success: true,
          message: 'Симуляция изменений выполнена',
          timestamp: new Date().toISOString()
        })

      case 'generate_report':
        // Генерируем отчет мониторинга
        const report = await crmMonitor.generateReport(1) // За последний час
        return NextResponse.json({
          success: true,
          report,
          timestamp: new Date().toISOString()
        })

      case 'clear_context':
        // Очищаем контекст саркастичных комментариев
        ContextManager.clearContext('sarcastic-comments')
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
