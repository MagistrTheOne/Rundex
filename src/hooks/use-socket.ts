// Rundex CRM - Хук для работы с Socket.IO
// Автор: MagistrTheOne, 2025

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  type: string
  sender: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  recipient?: {
    id: string
    name: string
    email: string
  }
  timestamp: Date
  isRead: boolean
  status?: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role: string
  }>
  lastMessage?: Message
  unreadCount: number
  isOnline: boolean
  type: 'direct' | 'group'
}

export const useSocket = () => {
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!session?.user) return

    // Инициализируем Socket.IO соединение
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/api/socket',
      addTrailingSlash: false,
      auth: {
        token: session.user.email
      }
    })

    socketRef.current = socket

    // Обработчики событий
    socket.on('connect', () => {
      console.log('Connected to chat server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server')
      setIsConnected(false)
    })

    socket.on('connected', (data) => {
      console.log('Socket authenticated:', data)
    })

    socket.on('new_message', (data: { conversationId: string; message: Message }) => {
      console.log('New message received:', data)

      // Добавляем сообщение в локальное состояние
      setMessages(prev => [...prev, data.message])

      // Обновляем список бесед
      setConversations(prev =>
        prev.map(conv =>
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.message,
                unreadCount: conv.unreadCount + 1
              }
            : conv
        )
      )

      // Показываем уведомление (если нужно)
      if (Notification.permission === 'granted') {
        new Notification(`Новое сообщение от ${data.message.sender.name}`, {
          body: data.message.content,
          icon: '/favicon.ico'
        })
      }
    })

    socket.on('message_sent', (message: Message) => {
      console.log('Message sent confirmation:', message)
      setMessages(prev => [...prev, message])
    })

    socket.on('messages_read', (data: { by: string; conversationId: string }) => {
      // Отмечаем сообщения как прочитанные
      setMessages(prev =>
        prev.map(msg =>
          msg.sender.id === data.by && msg.sender.id !== session.user?.email
            ? { ...msg, isRead: true }
            : msg
        )
      )

      // Обновляем счетчик непрочитанных
      setConversations(prev =>
        prev.map(conv =>
          conv.id === data.conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    })

    socket.on('typing_start', (data: { from: string }) => {
      setTypingUsers(prev => new Set([...prev, data.from]))
    })

    socket.on('typing_stop', (data: { from: string }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.from)
        return newSet
      })
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    // Очистка при размонтировании
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [session])

  // Методы для работы с сообщениями
  const sendMessage = (recipientId: string, content: string, type: string = 'TEXT') => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected')
      return
    }

    socketRef.current.emit('send_message', {
      recipientId,
      content,
      type
    })
  }

  const markAsRead = (conversationId: string) => {
    if (!socketRef.current || !isConnected) return

    socketRef.current.emit('mark_as_read', { conversationId })
  }

  const startTyping = (conversationId: string) => {
    if (!socketRef.current || !isConnected) return

    socketRef.current.emit('typing_start', { conversationId })
  }

  const stopTyping = (conversationId: string) => {
    if (!socketRef.current || !isConnected) return

    socketRef.current.emit('typing_stop', { conversationId })
  }

  return {
    socket: socketRef.current,
    isConnected,
    messages,
    conversations,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping
  }
}
