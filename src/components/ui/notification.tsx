// Rundex CRM - Компонент уведомлений
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Clock
} from "lucide-react"

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

interface NotificationProps {
  notification: Notification
  onClose: (id: string) => void
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    iconColor: 'text-green-400',
    badgeColor: 'bg-green-500/20 text-green-400'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
    badgeColor: 'bg-red-500/20 text-red-400'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    badgeColor: 'bg-yellow-500/20 text-yellow-400'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/20 text-blue-400'
  }
}

function NotificationItem({ notification, onClose }: NotificationProps) {
  const config = notificationConfig[notification.type]
  const Icon = config.icon

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose(notification.id)
      }, notification.duration)

      return () => clearTimeout(timer)
    }
  }, [notification.duration, notification.id, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="mb-3"
    >
      <Card className={`${config.bgColor} ${config.borderColor} border backdrop-blur-xl`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-1.5 rounded-full ${config.bgColor}`}>
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-white truncate">
                  {notification.title}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClose(notification.id)}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {notification.message && (
                <p className="text-sm text-white/70 mb-2">
                  {notification.message}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`${config.badgeColor} text-xs`}>
                    {notification.type}
                  </Badge>
                  <div className="flex items-center text-xs text-white/50">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  maxNotifications?: number
}

export function NotificationContainer({
  notifications,
  onClose,
  position = 'top-right',
  maxNotifications = 5
}: NotificationContainerProps) {
  const displayedNotifications = notifications.slice(0, maxNotifications)

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-96 max-w-sm`}>
      <AnimatePresence mode="popLayout">
        {displayedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Хук для управления уведомлениями
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    type: Notification['type'],
    title: string,
    message?: string,
    duration = 5000
  ) => {
    const id = Date.now().toString()
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    }

    setNotifications(prev => [notification, ...prev])

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
}
