// Rundex CRM - Middleware для аутентификации и авторизации
// Автор: MagistrTheOne, 2025

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { rateLimitMiddleware } from "@/middleware/rate-limit"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')

    // Применяем rate limiting для API запросов
    if (isApiRoute) {
      const rateLimitResult = await rateLimitMiddleware(req)
      if (rateLimitResult instanceof NextResponse) {
        return rateLimitResult
      }
    }

    // Перенаправление неавторизованных пользователей с защищенных страниц
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Защита API роутов (кроме аутентификации)
    if (isApiRoute && !isAuth && !req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    // Защита dashboard роутов
    if (isDashboardRoute && !isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Проверка ролей для админских роутов
    if (isDashboardRoute && token?.role !== 'ADMIN' && req.nextUrl.pathname.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Разрешаем доступ к публичным страницам без токена
        if (!req.nextUrl.pathname.startsWith('/dashboard') && !req.nextUrl.pathname.startsWith('/api/')) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
