// Rundex CRM - Middleware для Rate Limiting
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function rateLimitMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Определяем тип rate limiting на основе пути
  let limitType: 'auth' | 'api' | 'analytics' | 'messages' | 'general' = 'general'

  if (pathname.startsWith('/api/auth')) {
    limitType = 'auth'
  } else if (pathname.includes('/api/analytics')) {
    limitType = 'analytics'
  } else if (pathname.includes('/api/messages')) {
    limitType = 'messages'
  } else if (pathname.startsWith('/api/')) {
    limitType = 'api'
  }

  // Получаем IP адрес клиента
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'anonymous'

  const identifier = `${limitType}:${ip}:${pathname}`

  try {
    const result = await checkRateLimit(identifier, limitType)

    if (!result.success) {
      const resetTime = result.reset || Date.now() + 60000 // Default to 1 minute from now
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Превышен лимит запросов. Попробуйте позже.',
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(resetTime).toISOString()
          }
        }
      )
    }

    // Возвращаем заголовки для ответа
    const resetTime = result.reset || Date.now() + 60000
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString())

    return response
  } catch (error) {
    console.error('Rate limiting middleware error:', error)

    // В случае ошибки пропускаем запрос
    return NextResponse.next()
  }
}
