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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Send, User, Sparkles, TrendingUp, Users, Target, CheckSquare, Download, Cpu, Zap, History, MessageSquare } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  confidence?: number
  source?: 'gigachat' | 'openai' | 'fallback'
  data?: any
  isEditing?: boolean
}

const initialSuggestions = [
  "Показать статистику лидов за последний месяц",
  "Какие лиды требуют срочного внимания?",
  "Проанализировать эффективность продаж",
  "Создать отчёт по выполненным задачам",
  "Найти контакты из Москвы"
]

interface ChatSession {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  preview: {
    lastMessage: string
    lastMessageTime: Date
  } | null
  recentMessages: Array<{
    id: string
    role: string
    content: string
    createdAt: Date
    confidence?: number
    source?: string
  }>
}

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
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Загрузка истории чатов
  const loadChatHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch("/api/volodya/history", {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.sessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          preview: session.preview ? {
            ...session.preview,
            lastMessageTime: new Date(session.preview.lastMessageTime)
          } : null,
          recentMessages: session.recentMessages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          }))
        })))
      }
    } catch (error) {
      console.error("Ошибка загрузки истории чатов:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Загрузка конкретной сессии чата
  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await fetch("/api/volodya/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        const data = await response.json()
        const formattedMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          confidence: msg.confidence,
          source: msg.source as 'gigachat' | 'openai' | 'fallback',
          data: msg.data
        }))

        setMessages(formattedMessages)
        setCurrentSessionId(sessionId)
      }
    } catch (error) {
      console.error("Ошибка загрузки сессии чата:", error)
    }
  }

  // Создание нового чата
  const startNewChat = () => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: "Привет! Я Володя, ваш AI-ассистент в Rundex CRM. Я могу помочь вам анализировать данные, отвечать на вопросы о лидах, контактах и продажах, а также давать рекомендации. Чем могу помочь?",
      timestamp: new Date(),
      suggestions: initialSuggestions
    }])
    setCurrentSessionId(null)
  }

  // Начать редактирование сообщения
  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  // Сохранить отредактированное сообщение
  const saveEditedMessage = () => {
    if (!editingMessageId || !editingContent.trim()) return

    setMessages(prev => prev.map(msg =>
      msg.id === editingMessageId
        ? { ...msg, content: editingContent.trim(), isEditing: false }
        : msg
    ))

    setEditingMessageId(null)
    setEditingContent("")
  }

  // Отменить редактирование
  const cancelEditing = () => {
    setEditingMessageId(null)
    setEditingContent("")
  }

  // Обработка клавиш в поле ввода (для textarea)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (editingMessageId) {
        saveEditedMessage()
      } else {
        handleSendMessage()
      }
    } else if (e.key === "Escape" && editingMessageId) {
      cancelEditing()
    }
  }

  const handleExportData = (data: any, messageId: string) => {
    if (!data) return

    const exportData = {
      timestamp: new Date().toISOString(),
      messageId,
      data
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `volodya-analysis-${messageId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'gigachat': return <Cpu className="w-3 h-3" />
      case 'openai': return <Zap className="w-3 h-3" />
      default: return <Bot className="w-3 h-3" />
    }
  }

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'gigachat': return 'GigaChat'
      case 'openai': return 'OpenAI'
      default: return 'Fallback'
    }
  }

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
        credentials: 'include', // Включаем cookies для аутентификации
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
        suggestions: data.suggestions,
        confidence: data.confidence,
        source: data.source,
        data: data.data
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

      {/* Интерфейс чата с вкладками */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Чат</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2" onClick={loadChatHistory}>
            <History className="w-4 h-4" />
            <span>История</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
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
                          {/* Режим редактирования */}
                          {editingMessageId === message.id && message.role === "user" ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full p-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={saveEditedMessage}
                                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  Сохранить
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                  Отмена
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="whitespace-pre-wrap">{message.content}</p>

                              {/* Кнопка редактирования для сообщений пользователя */}
                              {message.role === "user" && (
                                <button
                                  onClick={() => startEditingMessage(message.id, message.content)}
                                  className="text-xs opacity-60 hover:opacity-100 mt-1 text-blue-400 hover:text-blue-300"
                                  title="Редактировать сообщение"
                                >
                                  ✏️ Изменить
                                </button>
                              )}
                            </>
                          )}

                          {/* Метаданные для сообщений ассистента */}
                          {message.role === "assistant" && (message.confidence || message.source) && (
                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <div className="flex items-center space-x-2">
                                {message.source && (
                                  <div className="flex items-center space-x-1">
                                    {getSourceIcon(message.source)}
                                    <span>{getSourceLabel(message.source)}</span>
                                  </div>
                                )}
                                {message.confidence && (
                                  <span>Уверенность: {Math.round(message.confidence * 100)}%</span>
                                )}
                              </div>

                              {/* Кнопка экспорта данных */}
                              {message.data && (
                                <button
                                  onClick={() => handleExportData(message.data, message.id)}
                                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                                  title="Экспортировать данные анализа"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Экспорт</span>
                                </button>
                              )}
                            </div>
                          )}

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
              {messages[messages.length - 1]?.suggestions && messages[messages.length - 1].suggestions!.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-white/70">Рекомендуемые вопросы:</p>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
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
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список чатов */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">История разговоров</CardTitle>
                      <CardDescription className="text-white/70">
                        Ваши предыдущие чаты с Володей
                      </CardDescription>
                    </div>
                    <Button
                      onClick={startNewChat}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Новый чат
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                  ) : chatHistory.length === 0 ? (
                    <div className="text-center py-8 text-white/70">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>История чатов пуста</p>
                      <p className="text-sm">Начните разговор с Володей</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {chatHistory.map((session) => (
                          <Card
                            key={session.id}
                            className={`glass-card cursor-pointer transition-all hover:bg-white/5 ${
                              currentSessionId === session.id ? 'ring-2 ring-blue-400' : ''
                            }`}
                            onClick={() => loadChatSession(session.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-medium mb-1">
                                    {session.title}
                                  </h4>
                                  <p className="text-white/70 text-sm mb-2">
                                    {session.messageCount} сообщений
                                  </p>
                                  {session.preview && (
                                    <p className="text-white/60 text-sm line-clamp-2">
                                      {session.preview.lastMessage}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-xs text-white/50">
                                  <p>{session.updatedAt.toLocaleDateString('ru-RU')}</p>
                                  <p>{session.updatedAt.toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Панель информации */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Статистика чатов</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Всего чатов</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {chatHistory.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Сообщений</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      {chatHistory.reduce((sum, session) => sum + session.messageCount, 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Сегодня</span>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {chatHistory.filter(session =>
                        session.updatedAt.toDateString() === new Date().toDateString()
                      ).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Полезные советы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-white/70">
                  <p>• Просматривайте старые разговоры для повторного использования инсайтов</p>
                  <p>• Экспортируйте важные данные анализа из сообщений</p>
                  <p>• Создавайте новые чаты для разных тем обсуждения</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
