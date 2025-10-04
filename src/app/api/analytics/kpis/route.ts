// Rundex CRM - API аналитики KPI
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCachedKPIs, CACHE_KEYS } from "@/lib/cache/cache-service"

// GET /api/analytics/kpis - Получить KPI метрики пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d" // 30d, 7d, 90d, 1y

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

    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Получаем KPI с кешированием
    const kpis = await getCachedKPIs(user.id, period, async () => {
      // Расчет KPI метрик
      const [
        leadsCount,
        opportunitiesCount,
        accountsCount,
        closedOpportunities,
        totalRevenue,
        previousLeadsCount,
        previousRevenue
      ] = await Promise.all([
      // Количество лидов за период
      prisma.lead.count({
        where: {
          assignedToId: user.id,
          createdAt: { gte: startDate }
        }
      }),

      // Количество возможностей
      prisma.opportunity.count({
        where: {
          assignedToId: user.id,
          createdAt: { gte: startDate }
        }
      }),

      // Количество компаний
      prisma.account.count({
        where: {
          ownerId: user.id,
          createdAt: { gte: startDate }
        }
      }),

      // Закрытые успешные сделки
      prisma.opportunity.count({
        where: {
          assignedToId: user.id,
          stage: "CLOSED_WON",
          createdAt: { gte: startDate }
        }
      }),

      // Общий доход от закрытых сделок
      prisma.opportunity.aggregate({
        where: {
          assignedToId: user.id,
          stage: "CLOSED_WON",
          createdAt: { gte: startDate }
        },
        _sum: {
          amount: true
        }
      }),

      // Лидов за предыдущий период (для сравнения)
      prisma.lead.count({
        where: {
          assignedToId: user.id,
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate
          }
        }
      }),

      // Доход за предыдущий период
      prisma.opportunity.aggregate({
        where: {
          assignedToId: user.id,
          stage: "CLOSED_WON",
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate
          }
        },
        _sum: {
          amount: true
        }
      })
    ])

    // Расчет конверсии (закрытые сделки / общее количество возможностей)
    const conversionRate = opportunitiesCount > 0 ? (closedOpportunities / opportunitiesCount) * 100 : 0

    // Расчет изменений в процентах
    const leadsChange = previousLeadsCount > 0
      ? ((leadsCount - previousLeadsCount) / previousLeadsCount) * 100
      : leadsCount > 0 ? 100 : 0

    const revenueChange = (previousRevenue._sum.amount || 0) > 0
      ? ((totalRevenue._sum.amount || 0) - (previousRevenue._sum.amount || 0)) / (previousRevenue._sum.amount || 0) * 100
      : (totalRevenue._sum.amount || 0) > 0 ? 100 : 0

    // Расчет средней суммы сделки
    const avgDealSize = closedOpportunities > 0 ? (totalRevenue._sum.amount || 0) / closedOpportunities : 0

      const kpis = {
        totalRevenue: {
          value: totalRevenue._sum.amount || 0,
          change: revenueChange,
          trend: revenueChange >= 0 ? "up" : "down",
          period: period
        },
        leadsCount: {
          value: leadsCount,
          change: leadsChange,
          trend: leadsChange >= 0 ? "up" : "down",
          period: period
        },
        opportunitiesCount: {
          value: opportunitiesCount,
          change: 0, // Пока без расчета изменения
          trend: "neutral",
          period: period
        },
        conversionRate: {
          value: conversionRate,
          change: 0, // Пока без расчета изменения
          trend: "neutral",
          period: period
        },
        accountsCount: {
          value: accountsCount,
          change: 0, // Пока без расчета изменения
          trend: "neutral",
          period: period
        },
        avgDealSize: {
          value: avgDealSize,
          change: 0, // Пока без расчета изменения
          trend: "neutral",
          period: period
        },
        closedDeals: {
          value: closedOpportunities,
          change: 0, // Пока без расчета изменения
          trend: "neutral",
          period: period
        }
      }

      return kpis
    })

    return NextResponse.json(kpis)
  } catch (error) {
    console.error("Ошибка при получении KPI:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
