// Rundex CRM - API трендов продаж
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/analytics/sales-trends - Получить тренды продаж по месяцам
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "6m" // 3m, 6m, 1y
    const type = searchParams.get("type") || "revenue" // revenue, deals, conversion

    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Определяем количество месяцев для анализа
    const monthsCount = period === "3m" ? 3 : period === "6m" ? 6 : 12

    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1)

    // Формируем данные по месяцам
    const monthlyData = []

    for (let i = 0; i < monthsCount; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - monthsCount + i + 1, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthsCount + i + 2, 0, 23, 59, 59)

      // Получаем данные за месяц
      const [monthlyRevenue, monthlyDeals, monthlyOpportunities] = await Promise.all([
        // Доход за месяц
        prisma.opportunity.aggregate({
          where: {
            assignedToId: user.id,
            stage: "CLOSED_WON",
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          },
          _sum: { amount: true },
          _count: true
        }),

        // Количество закрытых сделок
        prisma.opportunity.count({
          where: {
            assignedToId: user.id,
            stage: "CLOSED_WON",
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),

        // Общее количество возможностей
        prisma.opportunity.count({
          where: {
            assignedToId: user.id,
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
      ])

      const monthName = monthStart.toLocaleDateString('ru-RU', {
        month: 'short',
        year: 'numeric'
      })

      const revenue = monthlyRevenue._sum.amount || 0
      const dealsCount = monthlyDeals
      const opportunitiesCount = monthlyOpportunities
      const conversionRate = opportunitiesCount > 0 ? (dealsCount / opportunitiesCount) * 100 : 0

      monthlyData.push({
        month: monthName,
        year: monthStart.getFullYear(),
        monthIndex: monthStart.getMonth(),
        revenue: revenue,
        deals: dealsCount,
        opportunities: opportunitiesCount,
        conversion: Math.round(conversionRate * 100) / 100
      })
    }

    // Возвращаем данные в зависимости от типа запроса
    let responseData = monthlyData

    if (type === "revenue") {
      responseData = monthlyData.map(item => ({
        month: item.month,
        value: item.revenue,
        label: `${(item.revenue / 1000).toFixed(0)}k ₽`
      }))
    } else if (type === "deals") {
      responseData = monthlyData.map(item => ({
        month: item.month,
        value: item.deals,
        label: `${item.deals} сделок`
      }))
    } else if (type === "conversion") {
      responseData = monthlyData.map(item => ({
        month: item.month,
        value: item.conversion,
        label: `${item.conversion}%`
      }))
    }

    return NextResponse.json({
      data: responseData,
      type: type,
      period: period,
      total: {
        revenue: monthlyData.reduce((sum, item) => sum + item.revenue, 0),
        deals: monthlyData.reduce((sum, item) => sum + item.deals, 0),
        opportunities: monthlyData.reduce((sum, item) => sum + item.opportunities, 0),
        avgConversion: monthlyData.length > 0
          ? Math.round((monthlyData.reduce((sum, item) => sum + item.conversion, 0) / monthlyData.length) * 100) / 100
          : 0
      }
    })
  } catch (error) {
    console.error("Ошибка при получении трендов продаж:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
