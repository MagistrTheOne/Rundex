// Rundex CRM - Context Manager for Volodya
// Автор: MagistrTheOne, 2025

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { VolodyaMessage } from './sberAdapter'

interface ContextSession {
  sessionId: string
  messages: VolodyaMessage[]
  lastActivity: number
  expiresAt: number
}

export class ContextManager {
  private static readonly CONTEXT_DIR = join(process.cwd(), 'data', 'context')
  private static readonly MAX_MESSAGES = 5
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 минут
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 минут
  private static readonly MAX_SESSIONS = 1000 // Максимум сессий в памяти

  private static sessions: Map<string, ContextSession> = new Map()
  private static cleanupTimer: NodeJS.Timeout | null = null

  /**
   * Инициализация менеджера контекста
   */
  static initialize(): void {
    if (this.cleanupTimer) return // Уже инициализирован

    // Инициализируем очистку устаревших сессий
    this.cleanupTimer = setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL)

    // Graceful shutdown
    if (typeof process !== 'undefined') {
      process.on('SIGINT', () => this.shutdown())
      process.on('SIGTERM', () => this.shutdown())
    }
  }

  /**
   * Корректное завершение работы
   */
  private static shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }

    // Сохраняем все активные сессии
    for (const [sessionId, session] of this.sessions.entries()) {
      this.saveToFile(sessionId)
    }

    console.log('[ContextManager] Shutdown completed')
  }

  /**
   * Получает или создает сессию контекста
   */
  static getSession(sessionId: string): ContextSession {
    let session = this.sessions.get(sessionId)

    if (!session || Date.now() > session.expiresAt) {
      // Проверяем лимит сессий
      if (this.sessions.size >= this.MAX_SESSIONS) {
        this.evictOldestSession()
      }

      // Пытаемся загрузить из файла
      this.loadFromFile(sessionId)

      session = this.sessions.get(sessionId)

      if (!session) {
        session = {
          sessionId,
          messages: [],
          lastActivity: Date.now(),
          expiresAt: Date.now() + this.SESSION_TIMEOUT
        }
        this.sessions.set(sessionId, session)
      }
    }

    session.lastActivity = Date.now()
    return session
  }

  /**
   * Удаляет самую старую сессию при превышении лимита
   */
  private static evictOldestSession(): void {
    let oldestSessionId: string | null = null
    let oldestTime = Date.now()

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < oldestTime) {
        oldestTime = session.lastActivity
        oldestSessionId = sessionId
      }
    }

    if (oldestSessionId) {
      // Сохраняем перед удалением
      this.saveToFile(oldestSessionId)
      this.sessions.delete(oldestSessionId)
      console.log(`[ContextManager] Evicted old session: ${oldestSessionId}`)
    }
  }

  /**
   * Добавляет сообщение в контекст сессии
   */
  static addMessage(sessionId: string, message: Omit<VolodyaMessage, 'timestamp'>): void {
    const session = this.getSession(sessionId)

    const fullMessage: VolodyaMessage = {
      ...message,
      timestamp: Date.now()
    }

    session.messages.push(fullMessage)

    // Ограничиваем количество сообщений
    if (session.messages.length > this.MAX_MESSAGES) {
      session.messages = session.messages.slice(-this.MAX_MESSAGES)
    }

    this.sessions.set(sessionId, session)
  }

  /**
   * Получает последние сообщения из контекста
   */
  static getContext(sessionId: string): VolodyaMessage[] {
    const session = this.sessions.get(sessionId)
    return session?.messages || []
  }

  /**
   * Очищает устаревшие сессии
   */
  private static cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        toDelete.push(sessionId)
      }
    }

    toDelete.forEach(sessionId => this.sessions.delete(sessionId))

    if (toDelete.length > 0) {
      console.log(`[ContextManager] Cleaned up ${toDelete.length} expired sessions`)
    }
  }

  /**
   * Сохраняет контекст в файл (опционально, для персистентности)
   */
  static saveToFile(sessionId: string): void {
    try {
      const session = this.sessions.get(sessionId)
      if (!session || session.messages.length === 0) return

      // Создаем директорию если не существует
      if (!existsSync(this.CONTEXT_DIR)) {
        require('fs').mkdirSync(this.CONTEXT_DIR, { recursive: true })
      }

      const filePath = join(this.CONTEXT_DIR, `${sessionId}.json`)

      // Сериализуем только необходимые данные
      const serializedSession = {
        sessionId: session.sessionId,
        messages: session.messages,
        lastActivity: session.lastActivity,
        expiresAt: session.expiresAt
      }

      writeFileSync(filePath, JSON.stringify(serializedSession, null, 2), 'utf-8')
    } catch (error) {
      console.error('[ContextManager] Failed to save context to file:', error)
    }
  }

  /**
   * Загружает контекст из файла (опционально)
   */
  static loadFromFile(sessionId: string): void {
    try {
      const filePath = join(this.CONTEXT_DIR, `${sessionId}.json`)

      if (!existsSync(filePath)) return

      const data = readFileSync(filePath, 'utf-8')
      const parsedData = JSON.parse(data)

      // Валидируем структуру данных
      if (!parsedData.sessionId || !Array.isArray(parsedData.messages)) {
        console.warn(`[ContextManager] Invalid session data for ${sessionId}`)
        return
      }

      const session: ContextSession = {
        sessionId: parsedData.sessionId,
        messages: parsedData.messages,
        lastActivity: parsedData.lastActivity || Date.now(),
        expiresAt: parsedData.expiresAt || (Date.now() + this.SESSION_TIMEOUT)
      }

      // Проверяем актуальность
      if (Date.now() < session.expiresAt) {
        // Проверяем лимит перед загрузкой
        if (this.sessions.size < this.MAX_SESSIONS) {
          this.sessions.set(sessionId, session)
        } else {
          console.warn(`[ContextManager] Cannot load session ${sessionId}: memory limit reached`)
        }
      } else {
        // Удаляем устаревший файл
        try {
          require('fs').unlinkSync(filePath)
        } catch (unlinkError) {
          console.error('[ContextManager] Failed to delete expired session file:', unlinkError)
        }
      }
    } catch (error) {
      console.error(`[ContextManager] Failed to load context from file for ${sessionId}:`, error)

      // Удаляем поврежденный файл
      try {
        const filePath = join(this.CONTEXT_DIR, `${sessionId}.json`)
        if (existsSync(filePath)) {
          require('fs').unlinkSync(filePath)
        }
      } catch (cleanupError) {
        console.error('[ContextManager] Failed to cleanup corrupted session file:', cleanupError)
      }
    }
  }

  /**
   * Очистка контекста для сессии
   */
  static clearContext(sessionId: string): void {
    if (this.sessions.has(sessionId)) {
      this.saveToFile(sessionId) // Сохраняем перед удалением
      this.sessions.delete(sessionId)
    }
  }

  /**
   * Получает статистику по сессиям
   */
  static getStats(): { activeSessions: number; totalMessages: number } {
    let totalMessages = 0

    for (const session of this.sessions.values()) {
      totalMessages += session.messages.length
    }

    return {
      activeSessions: this.sessions.size,
      totalMessages
    }
  }
}
