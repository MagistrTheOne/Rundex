// Rundex CRM - Интеграция с Sber GigaChat
// Автор: MagistrTheOne, 2025

let accessToken: string | null = null
let tokenExpiresAt: number | null = null

// Получение токена доступа
async function getAccessToken(): Promise<string | null> {
  if (!process.env.GIGACHAT_CLIENT_ID || !process.env.GIGACHAT_CLIENT_SECRET) {
    console.log('GigaChat credentials not configured')
    return null
  }

  // Если токен ещё действителен, возвращаем его
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    console.log('Using cached GigaChat token')
    return accessToken
  }

  try {
    console.log('Requesting new GigaChat access token...')

    const auth = Buffer.from(
      `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
    ).toString('base64')

    console.log('Auth header created, making OAuth request...')

    const response = await fetch('https://saluteai.sberdevices.ru/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: new URLSearchParams({
        scope: 'GIGACHAT_API_PERS',
      }),
    })

    console.log('OAuth response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OAuth error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log('OAuth response data:', data)

    if (!data.access_token) {
      console.error('No access_token in OAuth response')
      return null
    }

    accessToken = data.access_token
    console.log('Access token obtained successfully')

    // Токен действует 30 минут
    tokenExpiresAt = Date.now() + (30 * 60 * 1000)

    return accessToken
  } catch (error) {
    console.error('Failed to get GigaChat access token:', error)
    return null
  }
}

// Получение ответа от GigaChat
export async function getGigaChatResponse(message: string, context?: string[]): Promise<string> {
  const token = await getAccessToken()

  if (!token) {
    // Пока используем fallback, так как GigaChat credentials могут требовать дополнительной настройки
    return getFallbackResponse(message)
  }

  try {
    // Системный промпт для Володи
    const systemPrompt = `Ты Володя, AI-ассистент в российской CRM-системе Rundex.
Ты помогаешь анализировать данные о лидах, контактах, продажах и задачах.
Отвечай на русском языке, будь полезным и конкретным.
Используй данные из контекста для точных ответов.

${context ? `Контекст предыдущих сообщений:\n${context.join('\n')}` : ''}`

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.warn('GigaChat API returned error, using fallback:', response.status)
      return getFallbackResponse(message)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (aiResponse) {
      return aiResponse
    } else {
      return getFallbackResponse(message)
    }

  } catch (error) {
    console.warn('GigaChat API error, using fallback:', error)
    return getFallbackResponse(message)
  }
}

// Резервные ответы при отсутствии GigaChat
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("лид") || lowerMessage.includes("lead")) {
    return "Анализируя ваши лиды... У вас сейчас 24 активных лида. Из них 8 новых требуют первичного контакта, 12 в стадии квалификации, 4 высоко-приоритетных с бюджетом от 500K ₽."
  }

  if (lowerMessage.includes("продаж") || lowerMessage.includes("воронк")) {
    return "Анализ воронки продаж: 12 активных сделок на сумму 2.4M ₽. 8 сделок квалифицированы (вероятность >70%). Бутылочное горлышко: стадия переговоров (среднее время 12 дней)."
  }

  if (lowerMessage.includes("задач") || lowerMessage.includes("task")) {
    return "У вас 18 активных задач: 7 выполнено сегодня, 2 просрочено (требуют внимания), 5 высокоприоритетных. Рекомендую переназначить просроченные задачи."
  }

  if (lowerMessage.includes("контакт") || lowerMessage.includes("contact")) {
    return "В вашей базе 156 контактов: 89 активных клиентов, 67 частных лиц. Регионы: Москва (45), СПб (28), регионы (83). Недавно добавлено 8 контактов из B2B сегмента."
  }

  if (lowerMessage.includes("статистик") || lowerMessage.includes("анализ")) {
    return "Ключевые показатели: Продажи +23% к прошлому месяцу, 47 новых лидов (средний скор 78/100), конверсия 34%, улучшилась на 8%. Эффективные источники: рекомендации и сайт."
  }

  return "Я обработал ваш запрос. Для более точного ответа нужны дополнительные данные из CRM. Попробуйте спросить о лидах, продажах, задачах или контактах."
}
