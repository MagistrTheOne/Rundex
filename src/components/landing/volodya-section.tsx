// Rundex CRM - Секция AI-ассистента Володи
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, MessageSquare, Loader2, Wifi, WifiOff } from "lucide-react"
import { landingContent } from "@/content/landing"

interface ChatMessage {
  user: string
  assistant: string
  source?: 'gigachat' | 'fallback' | 'error'
  confidence?: number
  tokens?: number
}

interface GigaChatStatus {
  status: 'online' | 'offline' | 'error'
  available: boolean
  contextStats: {
    activeSessions: number
    totalMessages: number
  }
}

export function VolodyaSection() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(landingContent.volodya.demo)
  const [isTyping, setIsTyping] = useState(false)
  const [gigaChatStatus, setGigaChatStatus] = useState<GigaChatStatus | null>(null)
  const [sessionId] = useState(() => `landing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  // Проверяем статус GigaChat при загрузке
  useEffect(() => {
    checkGigaChatStatus()
  }, [])

  const checkGigaChatStatus = async () => {
    try {
      const response = await fetch("/api/volodya/demo")
      if (response.ok) {
        const status = await response.json()
        setGigaChatStatus(status)
      }
    } catch (error) {
      console.error("Ошибка проверки статуса:", error)
      setGigaChatStatus({
        status: 'error',
        available: false,
        contextStats: { activeSessions: 0, totalMessages: 0 }
      })
    }
  }

  const handleSendMessage = async (message: string) => {
    if (isTyping) return

    setIsTyping(true)

    try {
      const response = await fetch("/api/volodya/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, sessionId }),
      })

      if (response.ok) {
        const data = await response.json()

        // Добавляем новый диалог в начало массива
        const newMessage: ChatMessage = {
          user: message,
          assistant: data.response,
          source: data.source,
          confidence: data.confidence,
          tokens: data.tokens
        }

        setChatMessages([newMessage, ...chatMessages.slice(0, 2)]) // Оставляем только 3 последних диалога

        // Обновляем статус после взаимодействия
        checkGigaChatStatus()
      }
    } catch (error) {
      console.error("Ошибка:", error)

      // Добавляем сообщение об ошибке
      setChatMessages([{
        user: message,
        assistant: "Извините, произошла ошибка при подключении к AI. Попробуйте позже.",
        source: 'error',
        confidence: 0
      }, ...chatMessages.slice(0, 2)])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка - текст */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-4">
              <Bot className="w-8 h-8 text-[#7B61FF] mr-3" />
              <span className="text-[#7B61FF] font-medium">AI-ассистент</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {landingContent.volodya.title}
            </h2>

            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              {landingContent.volodya.subtitle}
            </p>

            <p className="text-white/70 mb-8 leading-relaxed">
              {landingContent.volodya.description}
            </p>

            <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white px-8 py-3 font-semibold transition-all duration-300">
              {landingContent.volodya.cta}
            </Button>
          </motion.div>

          {/* Правая колонка - мокап чата */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-black/50 backdrop-blur-xl border-gray-800 shadow-2xl">
              <CardContent className="p-6">
                {/* Заголовок чата */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#7B61FF]/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[#7B61FF]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Володя AI</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-white/60 text-sm">
                          {gigaChatStatus?.status === 'online' ? 'GigaChat онлайн' :
                           gigaChatStatus?.status === 'offline' ? 'локальный режим' :
                           'проверка подключения...'}
                        </p>
                        {gigaChatStatus?.status === 'online' ? (
                          <Wifi className="w-3 h-3 text-green-400" />
                        ) : gigaChatStatus?.status === 'offline' ? (
                          <WifiOff className="w-3 h-3 text-yellow-400" />
                        ) : (
                          <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      gigaChatStatus?.status === 'online' ? 'bg-green-400' :
                      gigaChatStatus?.status === 'offline' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                </div>

                {/* Примеры диалога */}
                <div className="space-y-4 mb-6">
                  {chatMessages.map((item, index) => (
                    <div key={index} className="space-y-3">
                      {/* Сообщение пользователя */}
                      <div className="flex justify-end">
                        <div className="bg-[#7B61FF] text-white px-4 py-2 rounded-2xl rounded-br-md max-w-xs">
                          {item.user}
                        </div>
                      </div>

                      {/* Ответ Володи */}
                      <div className="flex justify-start">
                        <div className="flex space-x-3 max-w-md">
                          <div className="w-8 h-8 bg-[#7B61FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-[#7B61FF]" />
                          </div>
                          <div className="bg-white/5 backdrop-blur-sm border border-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
                            <p className="text-white text-sm">
                              {item.assistant}
                            </p>
                            {item.source && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
                                <span className="text-xs text-white/50">
                                  {item.source === 'gigachat' ? 'GigaChat AI' :
                                   item.source === 'fallback' ? 'локальный режим' :
                                   'ошибка'}
                                </span>
                                {item.confidence !== undefined && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    item.confidence > 0.8 ? 'bg-green-500/20 text-green-400' :
                                    item.confidence > 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {Math.round(item.confidence * 100)}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Индикатор печати */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3 max-w-md">
                        <div className="w-8 h-8 bg-[#7B61FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#7B61FF]" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Быстрые команды */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {[
                    "Показать активные сделки",
                    "Анализ эффективности команды",
                    "Прогноз продаж на квартал"
                  ].map((command, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(command)}
                      disabled={isTyping}
                      className="px-3 py-1 text-xs bg-white/5 border border-gray-800 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {command}
                    </button>
                  ))}
                </div>

                {/* Поле ввода */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Задайте вопрос Володе..."
                    className="flex-1 bg-white/5 border border-gray-800 rounded-full px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-[#7B61FF]/50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSendMessage(e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <button
                    className="w-10 h-10 bg-[#7B61FF] hover:bg-[#6B51EF] rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        handleSendMessage(input.value.trim())
                        input.value = ''
                      }
                    }}
                  >
                    {isTyping ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500/20 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
