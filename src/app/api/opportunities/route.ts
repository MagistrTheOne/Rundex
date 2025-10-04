// Rundex CRM - API для управления возможностями/сделками
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/opportunities - Получить все возможности пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const stage = searchParams.get("stage")
    const leadId = searchParams.get("leadId")

    const where: any = {
      assignedToId: session.user.email
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (stage && stage !== "ALL") {
      where.stage = stage
    }

    if (leadId) {
      where.leadId = leadId
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        account: {
          select: { id: true, name: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { stage: "asc" },
        { probability: "desc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(opportunities)
  } catch (error) {
    console.error("Ошибка при получении возможностей:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/opportunities - Создать новую возможность
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Валидация обязательных полей
    if (!data.name || !data.amount) {
      return NextResponse.json(
        { error: "Название и сумма обязательны" },
        { status: 400 }
      )
    }

    // Создание возможности
    const opportunity = await prisma.opportunity.create({
      data: {
        name: data.name,
        description: data.description,
        amount: parseFloat(data.amount),
        currency: data.currency || "RUB",
        stage: data.stage || "PROSPECTING",
        probability: data.probability || 0,
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
        leadId: data.leadId || null,
        accountId: data.accountId || null,
        assignedToId: data.assignedToId || session.user.email
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        account: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(opportunity, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании возможности:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
