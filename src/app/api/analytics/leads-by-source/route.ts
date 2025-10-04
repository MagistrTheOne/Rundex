// Rundex CRM - API источников лидов
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/analytics/leads-by-source - Получить статистику лидов по источникам
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d" // 7d, 30d, 90d, 1y

    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Рассчитываем дату начала периода
    const now = new Date()
    const startDate = new Date(now)
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Группируем лидов по источникам
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      where: {
        assignedToId: user.id,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Получаем общее количество лидов
    const totalLeads = await prisma.lead.count({
      where: {
        assignedToId: user.id,
        createdAt: { gte: startDate }
      }
    })

    // Преобразуем данные и рассчитываем проценты
    const sourceData = leadsBySource.map(item => {
      const percentage = totalLeads > 0 ? (item._count.id / totalLeads) * 100 : 0

      // Преобразуем enum значения в читаемые названия
      const sourceLabels: Record<string, string> = {
        'ORGANIC_SEARCH': 'Органический поиск',
        'PAID_ADS': 'Платная реклама',
        'SOCIAL_MEDIA': 'Социальные сети',
        'REFERRAL': 'Рефералы',
        'DIRECT': 'Прямой трафик',
        'EMAIL': 'Email рассылка',
        'PARTNERS': 'Партнеры',
        'OTHER': 'Другое'
      }

      return {
        source: item.source,
        label: sourceLabels[item.source] || item.source,
        count: item._count.id,
        percentage: Math.round(percentage * 100) / 100
      }
    })

    // Добавляем недостающие источники с нулевыми значениями для консистентности
    const allSources = ['ORGANIC_SEARCH', 'PAID_ADS', 'SOCIAL_MEDIA', 'REFERRAL', 'DIRECT', 'EMAIL', 'PARTNERS', 'OTHER']
    const completeSourceData = allSources.map(source => {
      const existing = sourceData.find(item => item.source === source)
      if (existing) return existing

      const sourceLabels: Record<string, string> = {
        'ORGANIC_SEARCH': 'Органический поиск',
        'PAID_ADS': 'Платная реклама',
        'SOCIAL_MEDIA': 'Социальные сети',
        'REFERRAL': 'Рефералы',
        'DIRECT': 'Прямой трафик',
        'EMAIL': 'Email рассылка',
        'PARTNERS': 'Партнеры',
        'OTHER': 'Другое'
      }

      return {
        source,
        label: sourceLabels[source] || source,
        count: 0,
        percentage: 0
      }
    }).filter(item => item.count > 0 || sourceData.length < 8) // Показываем только источники с данными или если данных мало

    return NextResponse.json({
      data: completeSourceData.sort((a, b) => b.count - a.count),
      total: totalLeads,
      period: period,
      topSource: completeSourceData[0] || null
    })
  } catch (error) {
    console.error("Ошибка при получении источников лидов:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
