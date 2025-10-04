// Rundex CRM - Sber GigaChat API Client
// Автор: MagistrTheOne, 2025

import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Отключаем SSL проверку для разработки (GigaChat использует самоподписанные сертификаты)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

interface SberTokenResponse {
  access_token: string
  expires_at: number  // timestamp in milliseconds
  token_type?: string
}

interface SberMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface SberRequest {
  model: string
  messages: SberMessage[]
  temperature?: number
  max_tokens?: number
}

interface SberChoice {
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

interface SberResponse {
  choices: SberChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class SberClient {
  private accessToken: string | null = null
  private tokenExpiresAt: number | null = null
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly authKey: string
  private readonly logFile: string

  constructor() {
    this.clientId = process.env.GIGACHAT_CLIENT_ID || ''
    this.clientSecret = process.env.GIGACHAT_CLIENT_SECRET || ''
    this.authKey = process.env.GIGACHAT_AUTH_KEY || ''

    // Создаем папку для логов если не существует
    const logDir = join(process.cwd(), 'logs')
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }
    this.logFile = join(logDir, 'sber.log')

    if (!this.clientId || !this.clientSecret) {
      this.log('ERROR', 'GigaChat credentials not configured')
    }
  }

  private log(level: 'INFO' | 'ERROR' | 'WARN', message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${level}: ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n`

    console.log(`[SberClient] ${level}: ${message}`)

    try {
      const stream = createWriteStream(this.logFile, { flags: 'a' })
      stream.write(logEntry)
      stream.end()
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  private async getAccessToken(): Promise<string | null> {
    // Если токен ещё действителен, возвращаем его
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    // Проверяем наличие credentials
    if (!this.clientId || !this.clientSecret) {
      this.log('ERROR', 'GigaChat credentials not configured')
      return null
    }

    try {
      this.log('INFO', 'Requesting new access token')

      // Используем Authorization Key если он передан, иначе формируем из Client ID и Secret
      const authHeader = this.authKey ||
        Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

      // Генерируем уникальный идентификатор запроса в формате UUID4
      const requestId = crypto.randomUUID()

      this.log('INFO', `Making OAuth request with RqUID: ${requestId}`)

      // Для разработки игнорируем SSL ошибки (только в dev режиме)
      let agent
      try {
        const https = require('https')
        agent = process.env.NODE_ENV === 'development' ?
          new https.Agent({ rejectUnauthorized: false }) : undefined
        this.log('INFO', 'SSL agent configured for OAuth request')
      } catch (error) {
        this.log('WARN', 'Could not configure SSL agent for OAuth', { error: error instanceof Error ? error.message : String(error) })
        agent = undefined
      }

      const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`,
          'RqUID': requestId,
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          scope: 'GIGACHAT_API_PERS',
        }),
        // @ts-ignore - для разработки
        agent
      })

      this.log('INFO', `OAuth response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        this.log('ERROR', `OAuth request failed: ${response.status}`, { error: errorText })
        throw new Error(`OAuth error: ${response.status} - ${errorText}`)
      }

      const data: SberTokenResponse = await response.json()
      this.log('INFO', 'OAuth response received', { hasToken: !!data.access_token })

      if (!data.access_token) {
        this.log('ERROR', 'No access_token in OAuth response', data)
        return null
      }

      this.accessToken = data.access_token

      // Используем expires_at из ответа (в миллисекундах)
      if (data.expires_at) {
        this.tokenExpiresAt = data.expires_at
      } else {
        // Fallback: 30 минут от текущего времени
        this.tokenExpiresAt = Date.now() + (30 * 60 * 1000)
      }

      this.log('INFO', 'Access token obtained successfully')
      return this.accessToken

    } catch (error) {
      this.log('ERROR', 'Failed to get access token', {
        error: error instanceof Error ? error.message : String(error)
      })
      return null
    }
  }

  async chat(request: SberRequest): Promise<SberResponse | null> {
    const token = await this.getAccessToken()

    if (!token) {
      this.log('WARN', 'No access token available')
      return null
    }

    try {
      this.log('INFO', 'Sending chat request', { messageCount: request.messages.length })

      // Для разработки игнорируем SSL ошибки (только в dev режиме)
      let agent
      try {
        const https = require('https')
        agent = process.env.NODE_ENV === 'development' ?
          new https.Agent({ rejectUnauthorized: false }) : undefined
        this.log('INFO', 'SSL agent configured for chat request')
      } catch (error) {
        this.log('WARN', 'Could not configure SSL agent for chat', { error: error instanceof Error ? error.message : String(error) })
        agent = undefined
      }

      const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
        // @ts-ignore - для разработки
        agent
      })

      if (!response.ok) {
        const errorText = await response.text()
        this.log('ERROR', `Chat request failed: ${response.status}`, { error: errorText })
        throw new Error(`Chat API error: ${response.status}`)
      }

      const data: SberResponse = await response.json()
      this.log('INFO', 'Chat response received', {
        choices: data.choices.length,
        tokens: data.usage.total_tokens
      })

      return data

    } catch (error) {
      this.log('ERROR', 'Chat request failed', { error: error instanceof Error ? error.message : String(error) })
      return null
    }
  }

  isAvailable(): boolean {
    return !!(this.clientId && this.clientSecret) || !!this.authKey
  }
}

// Singleton instance
const sberClient = new SberClient()

export default sberClient
export type { SberRequest, SberResponse, SberMessage }
