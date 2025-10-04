// Rundex CRM - Страница сообщений
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Send,
  Bell,
  BellOff,
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Paperclip,
  Smile,
  Settings,
  Archive,
  Trash2,
  Star,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

// Типы данных
interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  timestamp: string
  type: 'text' | 'file' | 'system'
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role: string
  }>
  lastMessage: Message
  unreadCount: number
  isOnline: boolean
  type: 'direct' | 'group' | 'system'
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  read: boolean
  actionUrl?: string
}

// Моковые данные
const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      { id: "1", name: "Анна Петрова", role: "Менеджер по продажам", avatar: "/avatars/anna.png" },
      { id: "current", name: "Администратор", role: "Администратор" }
    ],
    lastMessage: {
      id: "m1",
      sender: { id: "1", name: "Анна Петрова", role: "Менеджер по продажам" },
      content: "Новая сделка с компанией ТехноСервис закрыта!",
      timestamp: "2025-10-01T14:30:00Z",
      type: "text",
      status: "read"
    },
    unreadCount: 0,
    isOnline: true,
    type: "direct"
  },
  {
    id: "2",
    participants: [
      { id: "2", name: "Команда продаж", role: "Группа" }
    ],
    lastMessage: {
      id: "m2",
      sender: { id: "3", name: "Михаил Сергеев", role: "Руководитель отдела" },
      content: "Встреча по планированию на завтра в 10:00",
      timestamp: "2025-10-01T12:15:00Z",
      type: "text",
      status: "delivered"
    },
    unreadCount: 3,
    isOnline: false,
    type: "group"
  }
]

const mockMessages: Message[] = [
  {
    id: "m1",
    sender: { id: "1", name: "Анна Петрова", role: "Менеджер по продажам" },
    content: "Привет! Как продвигается работа над новым проектом?",
    timestamp: "2025-10-01T14:20:00Z",
    type: "text",
    status: "read"
  },
  {
    id: "m2",
    sender: { id: "current", name: "Администратор", role: "Администратор" },
    content: "Привет, Анна! Проект в хорошем темпе. Сегодня закрыли крупную сделку с ТехноСервис на 500к рублей.",
    timestamp: "2025-10-01T14:25:00Z",
    type: "text",
    status: "read"
  },
  {
    id: "m3",
    sender: { id: "1", name: "Анна Петрова", role: "Менеджер по продажам" },
    content: "Отлично! Поздравляю с закрытием! 🎉",
    timestamp: "2025-10-01T14:28:00Z",
    type: "text",
    status: "read"
  },
  {
    id: "m4",
    sender: { id: "1", name: "Анна Петрова", role: "Менеджер по продажам" },
    content: "Новая сделка с компанией ТехноСервис закрыта!",
    timestamp: "2025-10-01T14:30:00Z",
    type: "text",
    status: "read"
  }
]

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Новая задача",
    message: "Вам назначена новая задача: 'Подготовить презентацию для клиента'",
    type: "info",
    timestamp: "2025-10-01T13:45:00Z",
    read: false,
    actionUrl: "/dashboard/tasks"
  },
  {
    id: "n2",
    title: "Сделка закрыта",
    message: "Поздравляем! Сделка с компанией ТехноСервис успешно закрыта",
    type: "success",
    timestamp: "2025-10-01T12:30:00Z",
    read: true
  },
  {
    id: "n3",
    title: "Напоминание о встрече",
    message: "Встреча с клиентом через 30 минут",
    type: "warning",
    timestamp: "2025-10-01T11:00:00Z",
    read: false
  }
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: { id: "current", name: "Администратор", role: "Администратор" },
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent"
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Сообщения</h2>
          <p className="text-white/70 mt-1">
            Общение, уведомления и история взаимодействия
          </p>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="h-full"
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <CardHeader className="pb-3">
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="chat" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Чат
                  {mockConversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">
                      {mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <Bell className="w-4 h-4 mr-2" />
                  Уведомления
                  {unreadNotificationsCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <Clock className="w-4 h-4 mr-2" />
                  История
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              {/* Чат */}
              <TabsContent value="chat" className="h-full m-0">
                <div className="flex h-full">
                  {/* Список бесед */}
                  <div className="w-80 border-r border-white/10 flex flex-col">
                    <div className="p-4 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                        <Input
                          placeholder="Поиск бесед..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-2">
                        {mockConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                              selectedConversation?.id === conversation.id
                                ? 'bg-white/20'
                                : 'hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={conversation.participants[0].avatar} />
                                  <AvatarFallback className="bg-[#7B61FF]/20 text-white">
                                    {conversation.participants[0].name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {conversation.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-white font-medium truncate">
                                    {conversation.participants[0].name}
                                  </p>
                                  <span className="text-xs text-white/50">
                                    {new Date(conversation.lastMessage.timestamp).toLocaleTimeString('ru-RU', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-white/70 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                              </div>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Область чата */}
                  <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                      <>
                        {/* Заголовок беседы */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={selectedConversation.participants[0].avatar} />
                                <AvatarFallback className="bg-[#7B61FF]/20 text-white">
                                  {selectedConversation.participants[0].name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">
                                  {selectedConversation.participants[0].name}
                                </p>
                                <p className="text-sm text-white/50">
                                  {selectedConversation.isOnline ? 'В сети' : 'Не в сети'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                <Video className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Сообщения */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender.id === 'current' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender.id === 'current'
                                    ? 'bg-[#7B61FF] text-white'
                                    : 'bg-white/10 text-white'
                                }`}>
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>

                        {/* Поле ввода */}
                        <div className="p-4 border-t border-white/10">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                              <Paperclip className="w-4 h-4" />
                            </Button>
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              placeholder="Введите сообщение..."
                              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                              <Smile className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-white/60">
                        Выберите беседу для просмотра сообщений
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Уведомления */}
              <TabsContent value="notifications" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`cursor-pointer transition-colors ${
                          notification.read ? 'bg-white/5' : 'bg-white/10 border-l-4 border-l-blue-400'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-white">{notification.title}</h4>
                                <Badge className={`${
                                  notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                  notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                  notification.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/70">{notification.message}</p>
                              <p className="text-xs text-white/50 mt-2">
                                {new Date(notification.timestamp).toLocaleString('ru-RU')}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* История */}
              <TabsContent value="history" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="text-center text-white/60 py-8">
                      История сообщений и действий
                      <br />
                      <span className="text-sm">В разработке</span>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}
