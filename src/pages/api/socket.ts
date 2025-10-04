// Rundex CRM - Socket.IO сервер для real-time сообщений
// Автор: MagistrTheOne, 2025

import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface SocketWithUser extends Socket {
  userId?: string
  userEmail?: string
}

interface ServerWithIO extends NetServer {
  io?: ServerIO
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithUser & {
    server: ServerWithIO
  }
}

const SocketHandler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket.IO server already running')
    res.end()
    return
  }

  console.log('Setting up Socket.IO server...')

  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  res.socket.server.io = io

  // Middleware для аутентификации
  io.use(async (socket: SocketWithUser, next) => {
    try {
      const session = await getServerSession(
        { req: socket.request as any, res: res as any },
        authOptions
      )

      if (!session?.user?.email) {
        return next(new Error('Unauthorized'))
      }

      // Получаем пользователя из базы данных
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true }
      })

      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user.id
      socket.userEmail = user.email
      socket.data.user = user

      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: SocketWithUser) => {
    console.log(`User connected: ${socket.userEmail}`)

    // Присоединяемся к комнате пользователя для личных сообщений
    socket.join(`user_${socket.userId}`)

    // Отправляем подтверждение подключения
    socket.emit('connected', {
      userId: socket.userId,
      message: 'Successfully connected to chat server'
    })

    // Обработка отправки сообщения
    socket.on('send_message', async (data: {
      recipientId: string
      content: string
      type?: string
    }) => {
      try {
        const { recipientId, content, type = 'TEXT' } = data

        if (!recipientId || !content) {
          socket.emit('error', { message: 'Recipient and content are required' })
          return
        }

        // Проверяем, существует ли получатель
        const recipient = await prisma.user.findUnique({
          where: { id: recipientId },
          select: { id: true, name: true, email: true }
        })

        if (!recipient) {
          socket.emit('error', { message: 'Recipient not found' })
          return
        }

        // Создаем сообщение в базе данных
        const message = await (prisma as any).message.create({
          data: {
            content,
            type: type as any,
            senderId: socket.userId,
            recipientId: recipient.id,
            isRead: false
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            recipient: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })

        // Создаем активность
        await prisma.activity.create({
          data: {
            type: 'MESSAGE_SENT' as any,
            description: `Отправлено сообщение пользователю ${recipient.name || recipient.email}`,
            userId: socket.userId!
          }
        })

        // Форматируем сообщение для отправки
        const formattedMessage = {
          id: message.id,
          content: message.content,
          type: message.type,
          sender: message.sender,
          timestamp: message.createdAt,
          isRead: message.isRead
        }

        // Отправляем сообщение отправителю (подтверждение)
        socket.emit('message_sent', formattedMessage)

        // Отправляем сообщение получателю в real-time
        io.to(`user_${recipient.id}`).emit('new_message', {
          conversationId: socket.userId,
          message: formattedMessage
        })

        // Отправляем уведомление о новом сообщении всем подключенным клиентам отправителя
        socket.to(`user_${socket.userId}`).emit('message_notification', {
          type: 'new_message',
          from: message.sender,
          message: formattedMessage
        })

      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Обработка отметки сообщений как прочитанные
    socket.on('mark_as_read', async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data

        // Отмечаем сообщения как прочитанные
        await (prisma as any).message.updateMany({
          where: {
            senderId: conversationId,
            recipientId: socket.userId,
            isRead: false
          },
          data: {
            isRead: true,
            readAt: new Date()
          }
        })

        // Уведомляем отправителя о прочтении
        io.to(`user_${conversationId}`).emit('messages_read', {
          by: socket.userId,
          conversationId: socket.userId
        })

      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    })

    // Обработка статуса "печатает"
    socket.on('typing_start', (data: { conversationId: string }) => {
      socket.to(`user_${data.conversationId}`).emit('typing_start', {
        from: socket.userId
      })
    })

    socket.on('typing_stop', (data: { conversationId: string }) => {
      socket.to(`user_${data.conversationId}`).emit('typing_stop', {
        from: socket.userId
      })
    })

    // Обработка отключения
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userEmail}`)
    })
  })

  console.log('Socket.IO server initialized')
  res.end()
}

export default SocketHandler

export const config = {
  api: {
    bodyParser: false,
  },
}
