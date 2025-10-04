import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function APIDocsPage() {
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
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30">
            Документация API
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">REST API Rundex CRM</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Полноценное REST API для интеграции с Rundex CRM. Авторизация через Bearer токены,
            поддержка всех основных операций CRUD для клиентов, сделок и аналитики.
          </p>
        </div>

        {/* API Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Аутентификация
              </CardTitle>
              <CardDescription className="text-gray-300">
                Bearer токены с JWT. Поддержка refresh токенов для длительных сессий.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                CRUD операции
              </CardTitle>
              <CardDescription className="text-gray-300">
                Полный набор операций создания, чтения, обновления и удаления для всех сущностей.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Аналитика
              </CardTitle>
              <CardDescription className="text-gray-300">
                Детальные метрики и отчеты через API для интеграции с внешними системами.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Основные эндпоинты</CardTitle>
            <CardDescription className="text-gray-300">
              Структура API для работы с клиентами, сделками и аналитикой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Клиенты (Customers)</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-300">GET</Badge>
                    <code>/api/v1/customers</code>
                    <span>- Получить список клиентов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-300">POST</Badge>
                    <code>/api/v1/customers</code>
                    <span>- Создать клиента</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-300">PUT</Badge>
                    <code>/api/v1/customers/{'{id}'}</code>
                    <span>- Обновить клиента</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-300">DELETE</Badge>
                    <code>/api/v1/customers/{'{id}'}</code>
                    <span>- Удалить клиента</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Сделки (Deals)</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-300">GET</Badge>
                    <code>/api/v1/deals</code>
                    <span>- Получить сделки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-300">POST</Badge>
                    <code>/api/v1/deals</code>
                    <span>- Создать сделку</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-300">PATCH</Badge>
                    <code>/api/v1/deals/{'{id}'}/status</code>
                    <span>- Изменить статус</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Аналитика (Analytics)</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-300">GET</Badge>
                    <code>/api/v1/analytics/sales</code>
                    <span>- Метрики продаж</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-300">GET</Badge>
                    <code>/api/v1/analytics/conversion</code>
                    <span>- Конверсия воронки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-300">GET</Badge>
                    <code>/api/v1/analytics/kpi</code>
                    <span>- KPI показатели</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Примеры использования</CardTitle>
            <CardDescription className="text-gray-300">
              Базовые примеры интеграции с Rundex API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Получение списка клиентов</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X GET "https://api.rundex.com/v1/customers" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Создание клиента</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X POST "https://api.rundex.com/v1/customers" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "company": "ООО Пример",
    "phone": "+7 (495) 123-4567"
  }'`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">JavaScript SDK пример</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`import { RundexCRM } from '@rundex/crm-sdk';

const crm = new RundexCRM({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.rundex.com'
});

const customers = await crm.customers.list({
  limit: 50,
  offset: 0
});`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Готовы интегрировать API?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Получите доступ к полной документации и примерам кода для быстрой интеграции
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Получить API ключи
                </Button>
              </a>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Полная документация
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
