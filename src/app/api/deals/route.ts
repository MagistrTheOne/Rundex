// Rundex CRM - API для управления сделками
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/deals - Получить все сделки пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    const where: any = {
      userId: session.user.id
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    if (priority && priority !== "ALL") {
      where.priority = priority
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { lead: { firstName: { contains: search, mode: "insensitive" } } },
        { lead: { lastName: { contains: search, mode: "insensitive" } } }
      ]
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error("Ошибка при получении сделок:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/deals - Создать новую сделку
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Валидация обязательных полей
    if (!data.title || !data.leadId) {
      return NextResponse.json(
        { error: "Название и лид обязательны" },
        { status: 400 }
      )
    }

    // Создание сделки
    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        description: data.description,
        value: data.value ? parseFloat(data.value) : 0,
        currency: data.currency || "RUB",
        status: data.status || "NEW",
        priority: data.priority || "MEDIUM",
        stage: data.stage || "QUALIFICATION",
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : null,
        leadId: data.leadId,
        userId: session.user.id
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    })

    // Создание активности
    await prisma.activity.create({
      data: {
        type: "DEAL_CREATED",
        subject: `Создана сделка: ${deal.title}`,
        userId: session.user.id,
        dealId: deal.id
      }
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании сделки:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
