// Rundex CRM - Sber GigaChat API Client
// Автор: MagistrTheOne, 2025

import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface SberTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
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
  private readonly logFile: string

  constructor() {
    this.clientId = process.env.GIGACHAT_CLIENT_ID || ''
    this.clientSecret = process.env.GIGACHAT_CLIENT_SECRET || ''

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

    if (!this.clientId || !this.clientSecret) {
      return null
    }

    try {
      this.log('INFO', 'Requesting new access token')

      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

      const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,
        },
        body: new URLSearchParams({
          scope: 'GIGACHAT_API_PERS',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        this.log('ERROR', `OAuth request failed: ${response.status}`, { error: errorText })
        throw new Error(`OAuth error: ${response.status}`)
      }

      const data: SberTokenResponse = await response.json()

      if (!data.access_token) {
        this.log('ERROR', 'No access_token in OAuth response', data)
        return null
      }

      this.accessToken = data.access_token
      // Токен действует expires_in секунд, вычитаем 5 минут для безопасности
      this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000

      this.log('INFO', 'Access token obtained successfully')
      return this.accessToken

    } catch (error) {
      this.log('ERROR', 'Failed to get access token', { error: error.message })
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

      const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
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
      this.log('ERROR', 'Chat request failed', { error: error.message })
      return null
    }
  }

  isAvailable(): boolean {
    return !!(this.clientId && this.clientSecret)
  }
}

// Singleton instance
const sberClient = new SberClient()

export default sberClient
export type { SberRequest, SberResponse, SberMessage }
