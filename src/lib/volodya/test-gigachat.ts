// Rundex CRM - Тест GigaChat API
// Автор: MagistrTheOne, 2025

import sberClient from './sberClient'

export async function testGigaChatConnection() {
  console.log('🧪 Testing GigaChat connection...')
  console.log('📋 Client ID:', process.env.GIGACHAT_CLIENT_ID?.substring(0, 10) + '...')
  console.log('📋 Client Secret configured:', !!process.env.GIGACHAT_CLIENT_SECRET)
  console.log('📋 Auth Key configured:', !!process.env.GIGACHAT_AUTH_KEY)

  try {
    // Проверяем конфигурацию
    const hasCredentials = !!(
      (process.env.GIGACHAT_CLIENT_ID && process.env.GIGACHAT_CLIENT_SECRET) ||
      process.env.GIGACHAT_AUTH_KEY
    )
    console.log('📋 Credentials configured:', hasCredentials)

    if (!hasCredentials) {
      console.log('❌ GigaChat credentials not found in environment')
      return { success: false, error: 'No credentials' }
    }

    // Проверяем доступность клиента
    const sberClient = (await import('./sberClient')).default
    if (!sberClient.isAvailable()) {
      console.log('❌ SberClient reports as unavailable')
      return { success: false, error: 'Client unavailable' }
    }

    // Тестируем получение токена напрямую
    console.log('🔑 Testing direct OAuth request...')

    const auth = Buffer.from(
      `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
    ).toString('base64')

    console.log('🔑 Auth header created, testing OAuth endpoint...')

    try {
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

      console.log('🔑 OAuth response status:', response.status)
      console.log('🔑 OAuth response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log('🔑 OAuth error response:', errorText)
        return { success: false, error: `OAuth failed: ${response.status} - ${errorText}` }
      }

      const data = await response.json()
      console.log('🔑 OAuth success! Token received:', !!data.access_token)

      if (!data.access_token) {
        return { success: false, error: 'No access_token in OAuth response' }
      }

      // Тестируем chat API с полученным токеном
      console.log('🤖 Testing chat API with token...')

      const chatResponse = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access_token}`,
        },
        body: JSON.stringify({
          model: 'GigaChat',
          messages: [{ role: 'user', content: 'Привет! Ты GigaChat?' }],
          max_tokens: 50,
          temperature: 0.1
        }),
      })

      console.log('🤖 Chat response status:', chatResponse.status)

      if (!chatResponse.ok) {
        const errorText = await chatResponse.text()
        console.log('🤖 Chat error response:', errorText)
        return { success: false, error: `Chat API failed: ${chatResponse.status} - ${errorText}` }
      }

      const chatData = await chatResponse.json()
      const message = chatData.choices?.[0]?.message?.content

      console.log('✅ Full GigaChat test successful!')
      console.log('📝 Response:', message?.substring(0, 100) + '...')

      return {
        success: true,
        response: message,
        tokens: chatData.usage?.total_tokens,
        model: chatData.model
      }

    } catch (fetchError) {
      console.error('🔑 Fetch error during OAuth:', fetchError)
      return {
        success: false,
        error: `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`
      }
    }

  } catch (error) {
    console.error('❌ GigaChat test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}
