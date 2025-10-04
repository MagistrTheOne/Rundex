import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-black/30 border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">Rundex</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Главная
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                О нас
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Цены
              </Link>
              <Link href="/premium" className="text-gray-300 hover:text-white transition-colors">
                Премиум
              </Link>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Войти
              </Button>
            </div>

            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-400/30">
            JavaScript SDK
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">JavaScript SDK для Rundex CRM</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Готовые библиотеки и инструменты для быстрой интеграции Rundex CRM
            с вашими веб-приложениями. Поддержка React, Vue, Angular и vanilla JavaScript.
          </p>
        </div>

        {/* SDK Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                TypeScript поддержка
              </CardTitle>
              <CardDescription className="text-gray-300">
                Полная типизация для лучшей разработки и IntelliSense
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Автоматическая авторизация
              </CardTitle>
              <CardDescription className="text-gray-300">
                Встроенная обработка токенов и автоматическое обновление сессий
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Реактивные данные
              </CardTitle>
              <CardDescription className="text-gray-300">
                Автоматическая синхронизация данных с сервером в реальном времени
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Installation */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Установка и настройка</CardTitle>
            <CardDescription className="text-gray-300">
              Начните использовать SDK за несколько минут
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">1. Установите пакет</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300 mb-2">NPM:</p>
                    <pre className="text-green-400 text-sm bg-gray-800 p-2 rounded">
{`npm install @rundex/crm-sdk`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-2">Yarn:</p>
                    <pre className="text-green-400 text-sm bg-gray-800 p-2 rounded">
{`yarn add @rundex/crm-sdk`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-2">CDN:</p>
                    <pre className="text-green-400 text-sm bg-gray-800 p-2 rounded">
{`<script src="https://cdn.rundex.com/sdk/v1/rundex-crm.min.js"></script>`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">2. Инициализация</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`import { RundexCRM } from '@rundex/crm-sdk';

const crm = new RundexCRM({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.rundex.com',
  environment: 'production' // или 'sandbox'
});

// Автоматическая авторизация
await crm.authenticate({
  token: 'your-jwt-token'
});`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Примеры использования</CardTitle>
            <CardDescription className="text-gray-300">
              Основные операции с клиентами и сделками
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Работа с клиентами</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`// Создание клиента
const newCustomer = await crm.customers.create({
  name: 'Иван Петров',
  email: 'ivan@example.com',
  company: 'ООО Пример',
  phone: '+7 (495) 123-4567'
});

console.log('Клиент создан:', newCustomer.id);

// Получение списка клиентов
const customers = await crm.customers.list({
  limit: 50,
  offset: 0,
  search: 'Иван'
});

// Обновление клиента
await crm.customers.update(customerId, {
  name: 'Иван Петрович Петров',
  phone: '+7 (495) 123-4568'
});`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Управление сделками</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`// Создание сделки
const deal = await crm.deals.create({
  customer_id: customerId,
  title: 'Продажа CRM системы',
  amount: 150000,
  currency: 'RUB',
  stage: 'proposal'
});

// Получение сделок по статусу
const activeDeals = await crm.deals.list({
  status: 'active',
  limit: 100
});

// Изменение статуса сделки
await crm.deals.updateStatus(dealId, 'won');

// Аналитика продаж
const salesMetrics = await crm.analytics.getSalesMetrics({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Реактивные данные (React)</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`import { useCustomers, useDeals } from '@rundex/crm-react';

function CustomerList() {
  const { customers, loading, error } = useCustomers({
    limit: 50,
    autoRefresh: true // Автообновление каждые 30 сек
  });

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDK Versions */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Версии и поддержка</CardTitle>
            <CardDescription className="text-gray-300">
              Информация о поддерживаемых версиях и окружениях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold">v1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Текущая версия</h3>
                <p className="text-gray-400 text-sm">v1.2.3 - последняя стабильная</p>
                <Badge className="mt-2 bg-green-500/20 text-green-300">Рекомендуется</Badge>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-400 font-bold">v2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Beta версия</h3>
                <p className="text-gray-400 text-sm">v2.0.0-beta - тестирование</p>
                <Badge className="mt-2 bg-yellow-500/20 text-yellow-300">Beta</Badge>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-400 font-bold">TS</span>
                </div>
                <h3 className="text-white font-semibold mb-2">TypeScript</h3>
                <p className="text-gray-400 text-sm">Полная типизация включена</p>
                <Badge className="mt-2 bg-purple-500/20 text-purple-300">Типизировано</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Готовы интегрировать SDK?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Начните разработку с готовыми инструментами и полной документацией
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  Получить доступ к SDK
                </Button>
              </a>
              <Link href="/docs/api">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Документация API
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
