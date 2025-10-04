// Rundex CRM - AI-ассистент 'Володя'
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Sparkles, TrendingUp, Users, Target, CheckSquare } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialSuggestions = [
  "Показать статистику лидов за последний месяц",
  "Какие лиды требуют срочного внимания?",
  "Проанализировать эффективность продаж",
  "Создать отчёт по выполненным задачам",
  "Найти контакты из Москвы"
]

export default function VolodyaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Привет! Я Володя, ваш AI-ассистент в Rundex CRM. Я могу помочь вам анализировать данные, отвечать на вопросы о лидах, контактах и продажах, а также давать рекомендации. Чем могу помочь?",
      timestamp: new Date(),
      suggestions: initialSuggestions
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Отправка запроса к AI API
      const response = await fetch("/api/volodya/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          context: {
            previousMessages: messages.slice(-5), // Последние 5 сообщений для контекста
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка API")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Ошибка при получении ответа от Володи:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, произошла ошибка при обработке вашего запроса. Попробуйте перефразировать вопрос.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Bot className="w-8 h-8 mr-3 text-blue-400" />
            Володя AI
          </h2>
          <p className="text-white/70 mt-1">
            Ваш интеллектуальный помощник в работе с CRM
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
          <Sparkles className="w-3 h-3 mr-1" />
          Онлайн
        </Badge>
      </div>

      {/* Интерфейс чата */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной чат */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">Чат с Володей</CardTitle>
              <CardDescription className="text-white/70">
                Задавайте вопросы о ваших данных, анализе и рекомендациях
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Сообщения */}
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={message.role === "user" ? "bg-white text-black" : "bg-blue-500/20 text-blue-400"}>
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-white text-black"
                            : "glass-card text-white"
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3 max-w-[80%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-500/20 text-blue-400">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="glass-card rounded-lg p-3 text-white">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Предложения */}
              {messages[messages.length - 1]?.suggestions && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-white/70">Рекомендуемые вопросы:</p>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-xs border-white/20 text-white/70 hover:bg-white/10"
                        disabled={isLoading}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Поле ввода */}
              <div className="mt-4 flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Задайте вопрос Володе..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Панель информации */}
        <div className="space-y-6">
          {/* Возможности Володи */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Что умеет Володя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Анализ данных</p>
                  <p className="text-xs text-white/70">Статистика, тренды, прогнозы</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Работа с лидами</p>
                  <p className="text-xs text-white/70">Квалификация, скоринг, рекомендации</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Воронка продаж</p>
                  <p className="text-xs text-white/70">Анализ этапов, оптимизация</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Управление задачами</p>
                  <p className="text-xs text-white/70">Приоритезация, распределение</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Быстрые команды */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Быстрые команды</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Показать срочные лиды",
                "Статистика за неделю",
                "Просроченные задачи",
                "Лучшие клиенты"
              ].map((command, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendMessage(command)}
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  disabled={isLoading}
                >
                  {command}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
