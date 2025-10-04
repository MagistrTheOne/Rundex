// Rundex CRM - Конфигурация Rate Limiting
// Автор: MagistrTheOne, 2025

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Fallback in-memory rate limiter для случаев, когда Redis недоступен
class InMemoryRateLimit {
  private cache = new Map<string, { count: number; resetTime: number }>()

  constructor(
    private requests: number = 10,
    private windowMs: number = 60 * 1000 // 1 minute
  ) {}

  async limit(identifier: string) {
    const now = Date.now()
    const key = identifier
    const existing = this.cache.get(key)

    if (!existing || now > existing.resetTime) {
      // Создаем новую запись
      const resetTime = now + this.windowMs
      this.cache.set(key, {
        count: 1,
        resetTime
      })
      return { success: true, remaining: this.requests - 1, reset: resetTime }
    }

    if (existing.count >= this.requests) {
      return {
        success: false,
        remaining: 0,
        reset: existing.resetTime
      }
    }

    existing.count++
    return { success: true, remaining: this.requests - existing.count, reset: existing.resetTime }
  }

  async reset(identifier: string) {
    this.cache.delete(identifier)
  }
}

// Настройки rate limiting для разных типов запросов
const rateLimitConfigs = {
  // API endpoints - строгие ограничения
  api: {
    requests: 100, // запросов
    window: "1 m", // за минуту
  },
  // Аналитика - умеренные ограничения
  analytics: {
    requests: 50,
    window: "1 m",
  },
  // Аутентификация - очень строгие
  auth: {
    requests: 5,
    window: "15 m",
  },
  // Сообщения - умеренные
  messages: {
    requests: 30,
    window: "1 m",
  },
  // Общие запросы - либеральные
  general: {
    requests: 200,
    window: "1 m",
  }
}

// Создаем экземпляры rate limiters
let redisRateLimiters: Record<string, Ratelimit> | null = null
let inMemoryRateLimiters: Record<string, InMemoryRateLimit> | null = null

// Функция для получения подходящего rate limiter
export function getRateLimiter(type: keyof typeof rateLimitConfigs = 'general') {
  const config = rateLimitConfigs[type]

  // Пытаемся использовать Redis, если доступен
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!redisRateLimiters) {
      redisRateLimiters = {}
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })

      for (const [key, config] of Object.entries(rateLimitConfigs)) {
        redisRateLimiters[key] = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(config.requests, "1 m"),
          analytics: true,
        })
      }
    }
    return redisRateLimiters[type]
  }

  // Fallback на in-memory rate limiting
  if (!inMemoryRateLimiters) {
    inMemoryRateLimiters = {}
    for (const [key, config] of Object.entries(rateLimitConfigs)) {
      inMemoryRateLimiters[key] = new InMemoryRateLimit(
        config.requests,
        config.window === "1 m" ? 60 * 1000 :
        config.window === "15 m" ? 15 * 60 * 1000 : 60 * 1000
      )
    }
  }
  return inMemoryRateLimiters[type]
}

// Функция для проверки rate limit
export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimitConfigs = 'general'
) {
  const limiter = getRateLimiter(type)

  try {
    if (limiter instanceof Ratelimit) {
      // Upstash rate limiter
      const result = await limiter.limit(identifier)
      return {
        success: !result.success,
        remaining: result.remaining,
        reset: result.reset,
        limit: rateLimitConfigs[type].requests
      }
    } else {
      // In-memory rate limiter
      const result = await limiter.limit(identifier)
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        limit: rateLimitConfigs[type].requests
      }
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // В случае ошибки разрешаем запрос
    return {
      success: true,
      remaining: 999,
      reset: Date.now() + 60000,
      limit: rateLimitConfigs[type].requests
    }
  }
}

// Middleware функция для Next.js API routes
export async function withRateLimit(
  request: Request,
  type: keyof typeof rateLimitConfigs = 'general'
) {
  // Получаем IP адрес клиента
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'anonymous'

  const identifier = `${type}:${ip}`

  const result = await checkRateLimit(identifier, type)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Превышен лимит запросов. Попробуйте позже.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.reset).toISOString()
        }
      }
    )
  }

  // Добавляем заголовки с информацией о rate limit
  const responseHeaders = new Headers()
  responseHeaders.set('X-RateLimit-Limit', result.limit.toString())
  responseHeaders.set('X-RateLimit-Remaining', result.remaining.toString())
  responseHeaders.set('X-RateLimit-Reset', new Date(result.reset).toISOString())

  return { headers: responseHeaders }
}
