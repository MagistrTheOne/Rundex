// Rundex CRM - API для управления индивидуальной компанией
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/accounts/[id] - Получить компанию по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const account = await prisma.account.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id
      },
      include: {
        contacts: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true, position: true }
        },
        opportunities: {
          select: { id: true, name: true, amount: true, stage: true, closeDate: true }
        }
      }
    })

    if (!account) {
      return NextResponse.json({ error: "Компания не найдена" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Ошибка при получении компании:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/accounts/[id] - Обновить компанию
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Проверяем что компания принадлежит пользователю
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id
      }
    })

    if (!existingAccount) {
      return NextResponse.json({ error: "Компания не найдена" }, { status: 404 })
    }

    // Обновление компании
    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
        name: data.name,
        website: data.website,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        region: data.region,
        industry: data.industry,
        employees: data.employees ? parseInt(data.employees) : null,
        revenue: data.revenue ? parseFloat(data.revenue) : null,
        description: data.description,
        status: data.status
      },
      include: {
        contacts: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true, position: true }
        }
      }
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error("Ошибка при обновлении компании:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/accounts/[id] - Удалить компанию
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем что компания принадлежит пользователю
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id
      }
    })

    if (!existingAccount) {
      return NextResponse.json({ error: "Компания не найдена" }, { status: 404 })
    }

    await prisma.account.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Компания удалена" })
  } catch (error) {
    console.error("Ошибка при удалении компании:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
