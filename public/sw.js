// Rundex CRM - Service Worker для push-уведомлений
// Автор: MagistrTheOne, 2025

const CACHE_NAME = 'rundex-crm-v1'
const STATIC_CACHE = 'rundex-static-v1'

// Ресурсы для кеширования
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/offline.html'
]

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.error('Error caching static assets:', error)
      })
  )
  self.skipWaiting()
})

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Обработка fetch запросов (кеширование)
self.addEventListener('fetch', (event) => {
  // Кешируем только GET запросы
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кеша, если есть
        if (response) {
          return response
        }

        // Иначе делаем запрос
        return fetch(event.request)
          .then((response) => {
            // Не кешируем ошибки или неуспешные ответы
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Кешируем успешные ответы API
            if (event.request.url.includes('/api/')) {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
            }

            return response
          })
          .catch(() => {
            // При ошибке сети возвращаем оффлайн страницу
            if (event.request.destination === 'document') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('Push message received:', event)

  let data = {}

  if (event.data) {
    data = event.data.json()
  }

  const options = {
    body: data.body || 'У вас новое уведомление',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Посмотреть',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Закрыть'
      }
    ],
    requireInteraction: true,
    silent: false
  }

  // Определяем тип уведомления и устанавливаем соответствующие настройки
  switch (data.type) {
    case 'new_lead':
      options.icon = '/icons/lead.png'
      options.badge = '/icons/lead-badge.png'
      options.body = `Новый лид: ${data.leadName || 'Неизвестный контакт'}`
      break

    case 'new_deal':
      options.icon = '/icons/deal.png'
      options.badge = '/icons/deal-badge.png'
      options.body = `Новая сделка: ${data.dealName || 'Новая возможность'} на сумму ${data.amount || 'не указана'}`
      break

    case 'task_reminder':
      options.icon = '/icons/task.png'
      options.badge = '/icons/task-badge.png'
      options.body = `Напоминание: ${data.taskTitle || 'Задача'}`
      options.vibrate = [200, 100, 200, 100, 200]
      break

    case 'new_message':
      options.icon = '/icons/message.png'
      options.badge = '/icons/message-badge.png'
      options.body = `Новое сообщение от ${data.senderName || 'пользователя'}`
      break

    case 'system':
      options.icon = '/icons/system.png'
      options.badge = '/icons/system-badge.png'
      options.body = data.body || 'Системное уведомление'
      break

    default:
      options.title = data.title || 'Rundex CRM'
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Rundex CRM', options)
  )
})

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event)

  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  // Открываем соответствующую страницу
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Проверяем, есть ли уже открытое окно с нужным URL
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        // Если нет, открываем новое окно
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Обработка фоновой синхронизации (для оффлайн функциональности)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)

  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages())
  }

  if (event.tag === 'background-sync-activities') {
    event.waitUntil(syncActivities())
  }
})

// Функции для фоновой синхронизации
async function syncMessages() {
  try {
    // Синхронизация неотправленных сообщений
    const cache = await caches.open('pending-messages')
    const keys = await cache.keys()

    for (const request of keys) {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.error('Failed to sync message:', error)
      }
    }
  } catch (error) {
    console.error('Message sync failed:', error)
  }
}

async function syncActivities() {
  try {
    // Синхронизация неотправленных активностей
    const cache = await caches.open('pending-activities')
    const keys = await cache.keys()

    for (const request of keys) {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.error('Failed to sync activity:', error)
      }
    }
  } catch (error) {
    console.error('Activity sync failed:', error)
  }
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }
})
