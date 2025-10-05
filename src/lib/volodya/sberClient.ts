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
  model: 'GigaChat' | 'GigaChat-Pro' | 'GigaChat-Max' | 'GigaChat-ProPreview' | 'GigaChat-MaxPreview'
  messages: SberMessage[]
  temperature?: number // 0.0 - 2.0
  max_tokens?: number // Максимум зависит от модели
  stream?: boolean // Потоковая передача
  repetition_penalty?: number // 0.1 - 2.0, штраф за повторения
  update_interval?: number // Для streaming, интервал обновлений в мс
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
    // Проверяем, действителен ли текущий токен (с запасом 5 минут)
    if (this.accessToken && this.tokenExpiresAt && Date.now() < (this.tokenExpiresAt - 5 * 60 * 1000)) {
      return this.accessToken
    }

    // Проверяем наличие credentials
    if (!this.clientId || !this.clientSecret) {
      this.log('ERROR', 'GigaChat credentials not configured')
      return null
    }

    // Максимум 3 попытки получения токена
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        this.log('INFO', `Requesting new access token (attempt ${attempt})`)

        // Используем Authorization Key если он передан, иначе формируем из Client ID и Secret
        const authHeader = this.authKey ||
          Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

        // Генерируем уникальный идентификатор запроса в формате UUID4
        const requestId = crypto.randomUUID()

        this.log('INFO', `Making OAuth request with RqUID: ${requestId}`)

        // Настраиваем HTTPS агент только для разработки
        let agent
        if (process.env.NODE_ENV === 'development') {
          try {
            const https = require('https')
            agent = new https.Agent({
              rejectUnauthorized: false,
              keepAlive: true,
              timeout: 30000
            })
          } catch (error) {
            this.log('WARN', 'Could not configure HTTPS agent', { error: error instanceof Error ? error.message : String(error) })
          }
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 секунд таймаут

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
          signal: controller.signal,
          // @ts-ignore - для разработки
          agent
        })

        clearTimeout(timeoutId)

        this.log('INFO', `OAuth response status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          this.log('ERROR', `OAuth request failed: ${response.status}`, { error: errorText })

          // Для некоторых ошибок имеет смысл повторить попытку
          if (response.status >= 500 && attempt < 3) {
            this.log('INFO', `Retrying OAuth request in ${attempt * 2} seconds...`)
            await new Promise(resolve => setTimeout(resolve, attempt * 2000))
            continue
          }

          throw new Error(`OAuth error: ${response.status} - ${errorText}`)
        }

        const data: SberTokenResponse = await response.json()
        this.log('INFO', 'OAuth response received', { hasToken: !!data.access_token })

        if (!data.access_token) {
          this.log('ERROR', 'No access_token in OAuth response', data)
          return null
        }

        this.accessToken = data.access_token

        // expires_at уже в миллисекундах согласно документации GigaChat
        if (data.expires_at && data.expires_at > Date.now()) {
          this.tokenExpiresAt = data.expires_at
        } else {
          // Fallback: 30 минут от текущего времени
          this.tokenExpiresAt = Date.now() + (30 * 60 * 1000)
        }

        this.log('INFO', 'Access token obtained successfully', {
          expiresAt: new Date(this.tokenExpiresAt).toISOString()
        })
        return this.accessToken

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          this.log('ERROR', `OAuth request timeout (attempt ${attempt})`)
        } else {
          this.log('ERROR', `Failed to get access token (attempt ${attempt})`, {
            error: error instanceof Error ? error.message : String(error)
          })
        }

        // Для последней попытки не ждем
        if (attempt < 3) {
          const delay = attempt * 2000 // Экспоненциальная задержка
          this.log('INFO', `Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    this.log('ERROR', 'All OAuth attempts failed')
    return null
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
