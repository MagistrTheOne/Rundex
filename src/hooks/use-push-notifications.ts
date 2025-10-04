// Rundex CRM - Хук для управления push-уведомлениями
// Автор: MagistrTheOne, 2025

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
}

export const usePushNotifications = () => {
  const { data: session } = useSession()
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Проверка поддержки уведомлений
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  // Регистрация Service Worker
  useEffect(() => {
    if (!isSupported || !session?.user) return

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        console.log('Service Worker registered:', reg)

        // Ожидаем активации
        await navigator.serviceWorker.ready

        setRegistration(reg)

        // Проверяем подписку
        const subscription = await reg.pushManager.getSubscription()
        setIsSubscribed(!!subscription)

      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    registerSW()
  }, [isSupported, session])

  // Запрос разрешения на уведомления
  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Push notifications not supported')
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      await subscribeToNotifications()
    }

    return result
  }

  // Подписка на push-уведомления
  const subscribeToNotifications = async () => {
    if (!registration) {
      throw new Error('Service Worker not registered')
    }

    try {
      // В реальном приложении здесь должен быть VAPID ключ
      // Для демонстрации используем пустые ключи
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

      if (!vapidPublicKey) {
        console.warn('VAPID public key not configured')
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Отправляем подписку на сервер
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: session?.user?.email
        }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        console.log('Successfully subscribed to push notifications')
      } else {
        throw new Error('Failed to subscribe on server')
      }

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  // Отписка от push-уведомлений
  const unsubscribeFromNotifications = async () => {
    if (!registration) return

    try {
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()

        // Уведомляем сервер об отписке
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            userId: session?.user?.email
          }),
        })

        setIsSubscribed(false)
        console.log('Successfully unsubscribed from push notifications')
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
    }
  }

  // Показать тестовое уведомление
  const showTestNotification = () => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    const notification = new Notification('Rundex CRM', {
      body: 'Тестовое push-уведомление',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'test-notification'
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Автоматически закрываем через 5 секунд
    setTimeout(() => {
      notification.close()
    }, 5000)
  }

  // Отправка уведомления о новом лиде
  const notifyNewLead = async (leadData: {
    id: string
    name: string
    email?: string
    source?: string
  }) => {
    if (!isSubscribed) return

    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_lead',
          title: 'Новый лид',
          body: `Получен новый лид: ${leadData.name}`,
          data: {
            id: leadData.id,
            leadName: leadData.name,
            email: leadData.email,
            source: leadData.source,
            url: `/dashboard/leads/${leadData.id}`
          },
          userId: session?.user?.email
        }),
      })
    } catch (error) {
      console.error('Failed to send lead notification:', error)
    }
  }

  // Отправка уведомления о новой сделке
  const notifyNewDeal = async (dealData: {
    id: string
    name: string
    amount?: number
    currency?: string
  }) => {
    if (!isSubscribed) return

    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_deal',
          title: 'Новая сделка',
          body: `Создана новая сделка: ${dealData.name}`,
          data: {
            id: dealData.id,
            dealName: dealData.name,
            amount: dealData.amount,
            currency: dealData.currency,
            url: `/dashboard/opportunities/${dealData.id}`
          },
          userId: session?.user?.email
        }),
      })
    } catch (error) {
      console.error('Failed to send deal notification:', error)
    }
  }

  // Отправка уведомления о задаче
  const notifyTaskReminder = async (taskData: {
    id: string
    title: string
    dueDate: string
  }) => {
    if (!isSubscribed) return

    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'task_reminder',
          title: 'Напоминание о задаче',
          body: `Задача: ${taskData.title}`,
          data: {
            id: taskData.id,
            taskTitle: taskData.title,
            dueDate: taskData.dueDate,
            url: `/dashboard/tasks/${taskData.id}`
          },
          userId: session?.user?.email
        }),
      })
    } catch (error) {
      console.error('Failed to send task notification:', error)
    }
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    registration,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    showTestNotification,
    notifyNewLead,
    notifyNewDeal,
    notifyTaskReminder
  }
}

// Вспомогательная функция для конвертации VAPID ключа
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
