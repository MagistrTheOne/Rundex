// Rundex CRM - API отправки отчетов по email
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { emailService } from "@/lib/email/email-service"
import { generatePDFReport } from "@/lib/pdf/report-generator"
import { prisma } from "@/lib/prisma"

// POST /api/email/send-report - Отправить отчет по email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const {
      reportType,
      format = "pdf",
      recipientEmail,
      recipientName,
      includePdf = true,
      startDate,
      endDate,
      period = "30d"
    } = body

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email получателя обязателен" },
        { status: 400 }
      )
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем готовность email сервиса
    if (!emailService.isReady()) {
      return NextResponse.json(
        { error: "Email сервис не настроен. Проверьте конфигурацию SendGrid." },
        { status: 503 }
      )
    }

    // Определяем даты для фильтрации
    let dateFilter: { gte?: Date; lte?: Date } = {}

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      const now = new Date()
      const start = new Date(now)
      switch (period) {
        case "7d":
          start.setDate(now.getDate() - 7)
          break
        case "30d":
          start.setDate(now.getDate() - 30)
          break
        case "90d":
          start.setDate(now.getDate() - 90)
          break
        case "1y":
          start.setFullYear(now.getFullYear() - 1)
          break
        default:
          start.setDate(now.getDate() - 30)
      }
      dateFilter = { gte: start, lte: now }
    }

    // Собираем данные отчета
    let reportData: any = {}
    let reportTitle = ""

    switch (reportType) {
      case "sales":
        reportData = await generateSalesReportData(user.id, dateFilter)
        reportTitle = "Отчет по продажам"
        break

      case "analytics":
        reportData = await generateAnalyticsReportData(user.id, dateFilter)
        reportTitle = "Аналитический отчет"
        break

      case "leads":
        reportData = await generateLeadsReportData(user.id, dateFilter)
        reportTitle = "Отчет по лидам"
        break

      default:
        return NextResponse.json({ error: "Неверный тип отчета" }, { status: 400 })
    }

    // Генерируем PDF если требуется
    let pdfBlob: Blob | undefined
    if (includePdf && format === "pdf") {
      pdfBlob = await generatePDFReport({
        title: reportTitle,
        type: reportType as any,
        dateRange: {
          start: dateFilter.gte?.toISOString().split('T')[0] || '',
          end: dateFilter.lte?.toISOString().split('T')[0] || ''
        },
        generatedAt: new Date().toISOString(),
        generatedBy: user.name || user.email,
        data: reportData.data || reportData,
        summary: reportData.summary
      })
    }

    // Отправляем отчет по email
    const recipient = {
      email: recipientEmail,
      name: recipientName
    }

    const success = await emailService.sendReportEmail(
      recipient,
      reportType,
      reportData,
      pdfBlob
    )

    if (success) {
      // Логируем отправку
      await prisma.activity.create({
        data: {
          type: "EMAIL_SENT",
          description: `Отправлен ${reportTitle} на ${recipientEmail}`,
          userId: user.id,
          metadata: {
            reportType,
            recipientEmail,
            format,
            includePdf
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: "Отчет успешно отправлен",
        recipient: recipientEmail
      })
    } else {
      return NextResponse.json(
        { error: "Не удалось отправить отчет" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Ошибка отправки отчета по email:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// Вспомогательные функции для сбора данных отчетов
async function generateSalesReportData(userId: string, dateFilter: any) {
  const [
    totalRevenue,
    dealsByStage,
    monthlyRevenue,
    topOpportunities,
    conversionStats
  ] = await Promise.all([
    // Общий доход
    prisma.opportunity.aggregate({
      where: {
        assignedToId: userId,
        stage: "CLOSED_WON",
        createdAt: dateFilter
      },
      _sum: { amount: true },
      _count: true
    }),

    // Сделки по этапам
    prisma.opportunity.groupBy({
      by: ['stage'],
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      _count: true,
      _sum: { amount: true }
    }),

    // Доход по месяцам
    prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as month,
        SUM("amount") as revenue,
        COUNT(*) as deals_count
      FROM "Opportunity"
      WHERE "assignedToId" = ${userId}
        AND "stage" = 'CLOSED_WON'
        AND "createdAt" >= ${dateFilter.gte}
        AND "createdAt" <= ${dateFilter.lte}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,

    // Топ возможностей
    prisma.opportunity.findMany({
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      select: {
        id: true,
        name: true,
        amount: true,
        stage: true,
        probability: true,
        lead: { select: { firstName: true, lastName: true } },
        account: { select: { name: true } }
      },
      orderBy: { amount: 'desc' },
      take: 10
    }),

    // Статистика конверсии
    prisma.opportunity.aggregate({
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      _count: true
    })
  ])

  const totalOpportunities = await prisma.opportunity.count({
    where: {
      assignedToId: userId,
      createdAt: dateFilter
    }
  })

  const closedWon = dealsByStage.find(d => d.stage === 'CLOSED_WON')?._count || 0

  return {
    summary: {
      totalRevenue: totalRevenue._sum.amount || 0,
      totalDeals: totalRevenue._count,
      avgDealSize: totalRevenue._count > 0 ? (totalRevenue._sum.amount || 0) / totalRevenue._count : 0,
      conversionRate: totalOpportunities > 0 ? (closedWon / totalOpportunities) * 100 : 0
    },
    data: {
      dealsByStage: dealsByStage.map(stage => ({
        stage: stage.stage,
        count: stage._count,
        value: stage._sum.amount || 0
      })),
      monthlyRevenue,
      topOpportunities: topOpportunities.map(opp => ({
        id: opp.id,
        name: opp.name,
        amount: opp.amount,
        stage: opp.stage,
        probability: opp.probability,
        contact: opp.lead ? `${opp.lead.firstName} ${opp.lead.lastName}` : null,
        company: opp.account?.name
      }))
    }
  }
}

async function generateAnalyticsReportData(userId: string, dateFilter: any) {
  const [
    totalRevenue,
    totalLeads,
    totalDeals,
    conversionRate
  ] = await Promise.all([
    prisma.opportunity.aggregate({
      where: {
        assignedToId: userId,
        stage: "CLOSED_WON",
        createdAt: dateFilter
      },
      _sum: { amount: true }
    }),
    prisma.lead.count({
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      }
    }),
    prisma.opportunity.count({
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      }
    }),
    prisma.opportunity.aggregate({
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      _count: true
    })
  ])

  const closedWon = await prisma.opportunity.count({
    where: {
      assignedToId: userId,
      stage: "CLOSED_WON",
      createdAt: dateFilter
    }
  })

  return {
    summary: {
      totalRevenue: totalRevenue._sum.amount || 0,
      totalLeads,
      totalDeals,
      conversionRate: totalDeals > 0 ? (closedWon / totalDeals) * 100 : 0
    },
    data: {
      kpis: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalLeads,
        conversionRate: totalDeals > 0 ? (closedWon / totalDeals) * 100 : 0,
        activeDeals: totalDeals - closedWon
      }
    }
  }
}

async function generateLeadsReportData(userId: string, dateFilter: any) {
  const leads = await prisma.lead.findMany({
    where: {
      assignedToId: userId,
      createdAt: dateFilter
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      source: true,
      status: true,
      createdAt: true,
      account: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const leadsBySource = await prisma.lead.groupBy({
    by: ['source'],
    where: {
      assignedToId: userId,
      createdAt: dateFilter
    },
    _count: true
  })

  return {
    summary: {
      totalLeads: leads.length
    },
    data: leads.map(lead => ({
      name: `${lead.firstName} ${lead.lastName}`,
      company: lead.company || '-',
      source: lead.source || '-',
      status: lead.status || '-',
      createdAt: lead.createdAt.toISOString().split('T')[0]
    })),
    leadsBySource
  }
}
