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

  private static sessions: Map<string, ContextSession> = new Map()

  static {
    // Инициализируем очистку устаревших сессий
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL)
  }

  /**
   * Получает или создает сессию контекста
   */
  static getSession(sessionId: string): ContextSession {
    let session = this.sessions.get(sessionId)

    if (!session || Date.now() > session.expiresAt) {
      session = {
        sessionId,
        messages: [],
        lastActivity: Date.now(),
        expiresAt: Date.now() + this.SESSION_TIMEOUT
      }
      this.sessions.set(sessionId, session)
    }

    session.lastActivity = Date.now()
    return session
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
      if (!session) return

      const filePath = join(this.CONTEXT_DIR, `${sessionId}.json`)

      // Создаем директорию если не существует
      const fs = require('fs')
      if (!existsSync(this.CONTEXT_DIR)) {
        fs.mkdirSync(this.CONTEXT_DIR, { recursive: true })
      }

      writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to save context to file:', error)
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
      const session: ContextSession = JSON.parse(data)

      // Проверяем актуальность
      if (Date.now() < session.expiresAt) {
        this.sessions.set(sessionId, session)
      } else {
        // Удаляем устаревший файл
        require('fs').unlinkSync(filePath)
      }
    } catch (error) {
      console.error('Failed to load context from file:', error)
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
