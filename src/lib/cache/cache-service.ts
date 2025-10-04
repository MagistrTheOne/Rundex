// Rundex CRM - Сервис кеширования
// Автор: MagistrTheOne, 2025

import { Redis } from '@upstash/redis'

// In-memory fallback для случаев, когда Redis недоступен
class InMemoryCache {
  private cache = new Map<string, { value: any; expires: number }>()

  async get(key: string): Promise<any> {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expires = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 24 часа по умолчанию
    this.cache.set(key, { value, expires })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key)
    if (!item) return false
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key) || 0
    const newValue = current + 1
    await this.set(key, newValue)
    return newValue
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const item = this.cache.get(key)
    if (item) {
      item.expires = Date.now() + (ttlSeconds * 1000)
    }
  }

  async keys(pattern: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys())
    // Простая фильтрация по паттерну (в продакшене нужна более сложная логика)
    return allKeys.filter(key => key.includes(pattern.replace('*', '')))
  }
}

// Инициализация Redis или fallback
let redisClient: Redis | InMemoryCache
let isRedisAvailable = false

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  isRedisAvailable = true
  console.log('✅ Redis кеширование включено')
} else {
  redisClient = new InMemoryCache()
  console.log('⚠️ Redis не настроен, используется in-memory кеширование')
}

// Настройки TTL для разных типов данных (в секундах)
export const CACHE_TTL = {
  // Аналитика и KPI - кешируем на 5 минут
  analytics: 5 * 60,
  kpis: 5 * 60,
  salesTrends: 10 * 60,

  // Списки данных - кешируем на 2 минуты
  lists: 2 * 60,
  leads: 2 * 60,
  contacts: 2 * 60,
  accounts: 2 * 60,
  opportunities: 2 * 60,

  // Пользовательские данные - кешируем на 15 минут
  user: 15 * 60,
  profile: 15 * 60,

  // Сессии - кешируем на 1 час
  session: 60 * 60,

  // Отчеты - кешируем на 30 минут
  reports: 30 * 60,

  // API ответы - кешируем на 1 минуту
  api: 60,
}

// Префиксы ключей для организации
export const CACHE_KEYS = {
  // Аналитика
  analytics: (userId: string, type: string) => `analytics:${userId}:${type}`,
  kpis: (userId: string, period: string) => `kpis:${userId}:${period}`,
  salesTrends: (userId: string, period: string) => `sales_trends:${userId}:${period}`,
  leadsBySource: (userId: string, period: string) => `leads_source:${userId}:${period}`,
  pipeline: (userId: string, period: string) => `pipeline:${userId}:${period}`,

  // Списки
  leads: (userId: string, page: number, limit: number, filters?: string) =>
    `leads:${userId}:${page}:${limit}:${filters || 'none'}`,
  contacts: (userId: string, page: number, limit: number, filters?: string) =>
    `contacts:${userId}:${page}:${limit}:${filters || 'none'}`,
  accounts: (userId: string, page: number, limit: number, filters?: string) =>
    `accounts:${userId}:${page}:${limit}:${filters || 'none'}`,
  opportunities: (userId: string, page: number, limit: number, filters?: string) =>
    `opportunities:${userId}:${page}:${limit}:${filters || 'none'}`,

  // Пользовательские данные
  user: (userId: string) => `user:${userId}`,
  profile: (userId: string) => `profile:${userId}`,

  // Сессии
  session: (sessionId: string) => `session:${sessionId}`,

  // Отчеты
  report: (userId: string, type: string, period: string) =>
    `report:${userId}:${type}:${period}`,

  // API кеши
  api: (endpoint: string, params?: string) =>
    `api:${endpoint}:${params || 'default'}`,
}

// Класс сервиса кеширования
export class CacheService {
  private client: Redis | InMemoryCache

  constructor() {
    this.client = redisClient
  }

  // Проверка доступности Redis
  isRedisEnabled(): boolean {
    return isRedisAvailable
  }

  // Получение данных из кеша
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key)
      if (data === null) return null

      // Десериализация JSON если это строка
      if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
        return JSON.parse(data) as T
      }

      return data as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // Сохранение данных в кеш
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      // Сериализация объектов в JSON
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value

      if (ttlSeconds) {
        await this.client.set(key, serializedValue, { ex: ttlSeconds })
      } else {
        await this.client.set(key, serializedValue)
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // Удаление из кеша
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Cache del error:', error)
    }
  }

  // Проверка существования ключа
  async exists(key: string): Promise<boolean> {
    try {
      return await this.client.exists(key) === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // Инкремент значения
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key)
    } catch (error) {
      console.error('Cache incr error:', error)
      return 0
    }
  }

  // Установка TTL для существующего ключа
  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.expire(key, ttlSeconds)
    } catch (error) {
      console.error('Cache expire error:', error)
    }
  }

  // Получение ключей по паттерну
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern)
    } catch (error) {
      console.error('Cache keys error:', error)
      return []
    }
  }

  // Очистка кеша по префиксу
  async clearByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.keys(`${prefix}*`)
      if (keys.length > 0) {
        for (const key of keys) {
          await this.del(key)
        }
      }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  // Кеширование с fallback функцией
  async getOrSet<T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    // Пытаемся получить из кеша
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Если нет в кеше, выполняем функцию и кешируем результат
    const result = await fallbackFn()
    await this.set(key, result, ttlSeconds)

    return result
  }

  // Статистика кеша (только для Redis)
  async getStats(): Promise<any> {
    if (!isRedisAvailable) {
      return { type: 'in-memory', available: true }
    }

    try {
      const info = await (this.client as Redis).info()
      return {
        type: 'redis',
        available: true,
        info: info
      }
    } catch (error) {
      return {
        type: 'redis',
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Экспорт экземпляра сервиса
export const cacheService = new CacheService()

// Вспомогательные функции для работы с кешем

// Кеширование аналитики
export async function getCachedAnalytics(userId: string, type: string, fallbackFn: () => Promise<any>) {
  const key = CACHE_KEYS.analytics(userId, type)
  return await cacheService.getOrSet(key, fallbackFn, CACHE_TTL.analytics)
}

// Кеширование KPI
export async function getCachedKPIs(userId: string, period: string, fallbackFn: () => Promise<any>) {
  const key = CACHE_KEYS.kpis(userId, period)
  return await cacheService.getOrSet(key, fallbackFn, CACHE_TTL.kpis)
}

// Кеширование трендов продаж
export async function getCachedSalesTrends(userId: string, period: string, fallbackFn: () => Promise<any>) {
  const key = CACHE_KEYS.salesTrends(userId, period)
  return await cacheService.getOrSet(key, fallbackFn, CACHE_TTL.salesTrends)
}

// Очистка кеша пользователя
export async function clearUserCache(userId: string) {
  await cacheService.clearByPrefix(`analytics:${userId}`)
  await cacheService.clearByPrefix(`kpis:${userId}`)
  await cacheService.clearByPrefix(`leads:${userId}`)
  await cacheService.clearByPrefix(`contacts:${userId}`)
  await cacheService.clearByPrefix(`accounts:${userId}`)
  await cacheService.clearByPrefix(`opportunities:${userId}`)
  await cacheService.clearByPrefix(`report:${userId}`)
}

// Очистка всего кеша (для админов)
export async function clearAllCache() {
  if (isRedisAvailable) {
    try {
      await (redisClient as Redis).flushall()
      console.log('✅ Redis кеш очищен')
    } catch (error) {
      console.error('❌ Ошибка очистки Redis:', error)
    }
  } else {
    console.log('⚠️ In-memory кеш очищен (перезапуск сервера)')
  }
}
