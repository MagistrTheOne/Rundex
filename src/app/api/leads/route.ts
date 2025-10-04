// Rundex CRM - API для управления лидами
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/leads - Получить все лиды пользователя
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
      assignedToId: session.user.email
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    if (priority && priority !== "ALL") {
      where.priority = priority
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } }
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: { name: true, email: true }
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Ошибка при получении лидов:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/leads - Создать нового лида
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Валидация обязательных полей
    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: "Имя и фамилия обязательны" },
        { status: 400 }
      )
    }

    // Создание лида
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        website: data.website,
        address: data.address,
        city: data.city,
        region: data.region,
        source: data.source || "OTHER",
        status: data.status || "NEW",
        priority: data.priority || "MEDIUM",
        budget: data.budget ? parseFloat(data.budget) : null,
        notes: data.notes,
        assignedToId: session.user.email,
        score: Math.floor(Math.random() * 40) + 60 // Простой алгоритм скоринга
      },
      include: {
        assignedTo: {
          select: { name: true, email: true }
        }
      }
    })

    // Создание активности
    await prisma.activity.create({
      data: {
        type: "LEAD_CREATED",
        subject: `Создан лид: ${lead.firstName} ${lead.lastName}`,
        userId: session.user.email,
        leadId: lead.id
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
