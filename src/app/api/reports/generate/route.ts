// Rundex CRM - API генерации отчетов
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generatePDFReport } from "@/lib/pdf/report-generator"
import { prisma } from "@/lib/prisma"

// GET /api/reports/generate - Генерировать отчет
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type") || "sales" // sales, leads, accounts, activities
    const format = searchParams.get("format") || "json" // json, csv, pdf
    const period = searchParams.get("period") || "30d" // 7d, 30d, 90d, 1y
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
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

    let reportData: any = {}
    let reportTitle = ""
    let reportDescription = ""

    // Генерируем отчет в зависимости от типа
    switch (reportType) {
      case "sales":
        reportData = await generateSalesReport(user.id, dateFilter)
        reportTitle = "Отчет по продажам"
        reportDescription = "Анализ продаж, сделок и доходов"
        break

      case "leads":
        reportData = await generateLeadsReport(user.id, dateFilter)
        reportTitle = "Отчет по лидам"
        reportDescription = "Анализ источников и качества лидов"
        break

      case "accounts":
        reportData = await generateAccountsReport(user.id, dateFilter)
        reportTitle = "Отчет по компаниям"
        reportDescription = "Анализ клиентской базы"
        break

      case "activities":
        reportData = await generateActivitiesReport(user.id, dateFilter)
        reportTitle = "Отчет по активности"
        reportDescription = "Анализ действий и производительности"
        break

      default:
        return NextResponse.json({ error: "Неверный тип отчета" }, { status: 400 })
    }

    // Форматируем ответ в зависимости от запрошенного формата
    if (format === "csv") {
      const csvData = convertToCSV(reportData, reportType)
      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    if (format === "pdf") {
      // Генерируем PDF отчет
      const pdfBlob = await generatePDFReport({
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

      return new Response(pdfBlob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
        }
      })
    }

    // Для JSON возвращаем данные
    const report = {
      title: reportTitle,
      description: reportDescription,
      type: reportType,
      format: format,
      period: period,
      generatedAt: new Date().toISOString(),
      generatedBy: user.name || user.email,
      dateRange: dateFilter,
      data: reportData
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Ошибка при генерации отчета:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// Функции генерации отчетов
async function generateSalesReport(userId: string, dateFilter: any) {
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

async function generateLeadsReport(userId: string, dateFilter: any) {
  const [
    leadsBySource,
    leadsByStatus,
    conversionBySource,
    monthlyLeads
  ] = await Promise.all([
    // Лиды по источникам
    prisma.lead.groupBy({
      by: ['source'],
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      _count: true
    }),

    // Лиды по статусам
    prisma.lead.groupBy({
      by: ['status'],
      where: {
        assignedToId: userId,
        createdAt: dateFilter
      },
      _count: true
    }),

    // Конверсия по источникам
    prisma.$queryRaw`
      SELECT
        l.source,
        COUNT(*) as total_leads,
        COUNT(CASE WHEN o.id IS NOT NULL THEN 1 END) as converted_leads
      FROM "Lead" l
      LEFT JOIN "Opportunity" o ON l.id = o."leadId" AND o."stage" = 'CLOSED_WON'
      WHERE l."assignedToId" = ${userId}
        AND l."createdAt" >= ${dateFilter.gte}
        AND l."createdAt" <= ${dateFilter.lte}
      GROUP BY l.source
    `,

    // Лиды по месяцам
    prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as leads_count
      FROM "Lead"
      WHERE "assignedToId" = ${userId}
        AND "createdAt" >= ${dateFilter.gte}
        AND "createdAt" <= ${dateFilter.lte}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `
  ])

  return {
    leadsBySource,
    leadsByStatus,
    conversionBySource,
    monthlyLeads,
    totalLeads: leadsBySource.reduce((sum, item) => sum + item._count, 0)
  }
}

async function generateAccountsReport(userId: string, dateFilter: any) {
  const [
    accountsByIndustry,
    accountsByStatus,
    revenueByAccount,
    recentAccounts
  ] = await Promise.all([
    // Компании по отраслям
    prisma.account.groupBy({
      by: ['industry'],
      where: {
        ownerId: userId,
        createdAt: dateFilter
      },
      _count: true
    }),

    // Компании по статусам
    prisma.account.groupBy({
      by: ['status'],
      where: {
        ownerId: userId,
        createdAt: dateFilter
      },
      _count: true
    }),

    // Доход по компаниям
    prisma.$queryRaw`
      SELECT
        a.name as company_name,
        a.industry,
        SUM(o.amount) as total_revenue,
        COUNT(o.id) as deals_count
      FROM "Account" a
      LEFT JOIN "Opportunity" o ON a.id = o."accountId" AND o."stage" = 'CLOSED_WON'
      WHERE a."ownerId" = ${userId}
        AND a."createdAt" >= ${dateFilter.gte}
        AND a."createdAt" <= ${dateFilter.lte}
      GROUP BY a.id, a.name, a.industry
      ORDER BY total_revenue DESC
      LIMIT 20
    `,

    // Недавние компании
    prisma.account.findMany({
      where: {
        ownerId: userId,
        createdAt: dateFilter
      },
      select: {
        id: true,
        name: true,
        industry: true,
        status: true,
        website: true,
        createdAt: true,
        _count: {
          select: { opportunities: true, contacts: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  return {
    accountsByIndustry,
    accountsByStatus,
    revenueByAccount,
    recentAccounts
  }
}

async function generateActivitiesReport(userId: string, dateFilter: any) {
  const [
    activitiesByType,
    dailyActivity,
    userActivity
  ] = await Promise.all([
    // Активность по типам
    prisma.activity.groupBy({
      by: ['type'],
      where: {
        userId: userId,
        createdAt: dateFilter
      },
      _count: true
    }),

    // Ежедневная активность
    prisma.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as activities_count
      FROM "Activity"
      WHERE "userId" = ${userId}
        AND "createdAt" >= ${dateFilter.gte}
        AND "createdAt" <= ${dateFilter.lte}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,

    // Активность пользователя
    prisma.activity.findMany({
      where: {
        userId: userId,
        createdAt: dateFilter
      },
      select: {
        id: true,
        type: true,
        description: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  ])

  return {
    activitiesByType,
    dailyActivity,
    userActivity,
    totalActivities: userActivity.length
  }
}

// Вспомогательная функция для конвертации в CSV
function convertToCSV(data: any, type: string): string {
  // Простая реализация CSV конвертации
  // В реальном проекте лучше использовать библиотеку типа csv-writer
  let csv = ""

  if (type === "sales") {
    csv = "Месяц,Доход,Количество сделок\n"
    data.monthlyRevenue?.forEach((row: any) => {
      csv += `${row.month},${row.revenue},${row.deals_count}\n`
    })
  } else if (type === "leads") {
    csv = "Источник,Количество лидов\n"
    data.leadsBySource?.forEach((row: any) => {
      csv += `${row.source},${row._count}\n`
    })
  }

  return csv
}
