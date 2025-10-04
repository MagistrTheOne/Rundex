// Rundex CRM - API для операций с конкретным лидом
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: { id: string }
}

// GET /api/leads/[id] - Получить лид по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      },
      include: {
        assignedTo: {
          select: { name: true, email: true }
        },
        activities: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        opportunities: {
          include: {
            assignedTo: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: "Лид не найден" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Ошибка при получении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/leads/[id] - Обновить лид
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Проверка существования лида
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      }
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Лид не найден" }, { status: 404 })
    }

    // Обновление лида
    const lead = await prisma.lead.update({
      where: { id: params.id },
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
        source: data.source,
        status: data.status,
        priority: data.priority,
        budget: data.budget ? parseFloat(data.budget) : null,
        notes: data.notes,
        score: data.score || existingLead.score
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
        type: "STATUS_CHANGED",
        subject: `Обновлён лид: ${lead.firstName} ${lead.lastName}`,
        description: `Статус изменён на: ${lead.status}`,
        userId: session.user.email,
        leadId: lead.id
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Ошибка при обновлении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[id] - Удалить лид
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверка существования лида
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      }
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Лид не найден" }, { status: 404 })
    }

    // Удаление лида (каскадное удаление связанных данных)
    await prisma.lead.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Лид успешно удалён" })
  } catch (error) {
    console.error("Ошибка при удалении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
