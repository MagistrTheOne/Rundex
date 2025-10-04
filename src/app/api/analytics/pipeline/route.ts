// Rundex CRM - API воронки продаж
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/analytics/pipeline - Получить данные воронки продаж
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

    // Получаем данные по этапам воронки
    const pipelineData = await prisma.opportunity.groupBy({
      by: ['stage'],
      where: {
        assignedToId: user.id,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      _sum: {
        amount: true,
        probability: true
      },
      orderBy: {
        stage: 'asc'
      }
    })

    // Получаем среднюю вероятность для каждого этапа
    const stagesWithProbability = await Promise.all(
      pipelineData.map(async (stage) => {
        const avgProbability = await prisma.opportunity.aggregate({
          where: {
            assignedToId: user.id,
            stage: stage.stage,
            createdAt: { gte: startDate }
          },
          _avg: {
            probability: true
          }
        })

        return {
          ...stage,
          avgProbability: avgProbability._avg.probability || 0
        }
      })
    )

    // Преобразуем данные в читаемый формат
    const stageLabels: Record<string, string> = {
      'PROSPECTING': 'Поиск',
      'QUALIFICATION': 'Квалификация',
      'PROPOSAL': 'Предложение',
      'NEGOTIATION': 'Переговоры',
      'CLOSED_WON': 'Закрыта успешно',
      'CLOSED_LOST': 'Закрыта неудачно'
    }

    const stageProgress: Record<string, number> = {
      'PROSPECTING': 10,
      'QUALIFICATION': 25,
      'PROPOSAL': 50,
      'NEGOTIATION': 75,
      'CLOSED_WON': 100,
      'CLOSED_LOST': 0
    }

    const formattedPipeline = stagesWithProbability.map(stage => ({
      stage: stage.stage,
      label: stageLabels[stage.stage] || stage.stage,
      deals: stage._count.id,
      value: stage._sum.amount || 0,
      probability: Math.round(stage.avgProbability),
      progress: stageProgress[stage.stage] || 0
    }))

    // Рассчитываем общую статистику
    const totalValue = formattedPipeline.reduce((sum, stage) => sum + stage.value, 0)
    const totalDeals = formattedPipeline.reduce((sum, stage) => sum + stage.deals, 0)
    const wonDeals = formattedPipeline.find(s => s.stage === 'CLOSED_WON')?.deals || 0
    const lostDeals = formattedPipeline.find(s => s.stage === 'CLOSED_LOST')?.deals || 0
    const activeDeals = totalDeals - wonDeals - lostDeals

    // Расчет взвешенной вероятности успеха
    const weightedValue = formattedPipeline.reduce((sum, stage) => {
      if (stage.stage !== 'CLOSED_WON' && stage.stage !== 'CLOSED_LOST') {
        return sum + (stage.value * stage.probability / 100)
      }
      return sum
    }, 0)

    return NextResponse.json({
      data: formattedPipeline,
      summary: {
        totalValue,
        totalDeals,
        activeDeals,
        wonDeals,
        lostDeals,
        winRate: totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0,
        weightedValue: Math.round(weightedValue),
        avgDealSize: wonDeals > 0 ? Math.round(totalValue / wonDeals) : 0
      },
      period: period
    })
  } catch (error) {
    console.error("Ошибка при получении данных воронки:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
