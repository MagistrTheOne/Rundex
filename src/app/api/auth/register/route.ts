// Rundex CRM - API для регистрации пользователя
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, position, department } = await request.json()

    // Валидация обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Имя, email и пароль обязательны" },
        { status: 400 }
      )
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Некорректный формат email" },
        { status: 400 }
      )
    }

    // Валидация пароля (минимум 8 символов, хотя бы одна цифра и буква)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 8 символов" },
        { status: 400 }
      )
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: "Пароль должен содержать хотя бы одну букву и одну цифру" },
        { status: 400 }
      )
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        position,
        department,
        role: "USER", // По умолчанию обычный пользователь
      },
    })

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Пользователь успешно создан",
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
