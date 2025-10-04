// Rundex CRM - API для управления компаниями
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/accounts - Получить все компании пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const where: any = {
      ownerId: session.user.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } }
      ]
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    const accounts = await prisma.account.findMany({
      where,
      include: {
        contacts: {
          select: { id: true, firstName: true, lastName: true, position: true }
        },
        opportunities: {
          select: { id: true, name: true, amount: true, stage: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Ошибка при получении компаний:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/accounts - Создать новую компанию
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Валидация обязательных полей
    if (!data.name) {
      return NextResponse.json(
        { error: "Название компании обязательно" },
        { status: 400 }
      )
    }

    // Создание компании
    const account = await prisma.account.create({
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
        status: data.status || "ACTIVE",
        ownerId: session.user.id
      },
      include: {
        contacts: {
          select: { id: true, firstName: true, lastName: true, position: true }
        }
      }
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании компании:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
