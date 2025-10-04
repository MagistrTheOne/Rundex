import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function WebhooksPage() {
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
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-400/30">
            Webhooks
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">Настройка Webhooks</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Автоматические уведомления о событиях в Rundex CRM. Получайте мгновенные обновления
            о новых клиентах, изменении статусов сделок и других важных событиях.
          </p>
        </div>

        {/* Webhook Events */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Клиенты (Customers)
              </CardTitle>
              <CardDescription className="text-gray-300">
                События связанные с управлением клиентами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-300">customer.created</Badge>
                  <span className="text-gray-300">Новый клиент создан</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-300">customer.updated</Badge>
                  <span className="text-gray-300">Клиент обновлен</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500/20 text-red-300">customer.deleted</Badge>
                  <span className="text-gray-300">Клиент удален</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Сделки (Deals)
              </CardTitle>
              <CardDescription className="text-gray-300">
                Уведомления об изменениях в сделках и их статусах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-300">deal.created</Badge>
                  <span className="text-gray-300">Новая сделка создана</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-300">deal.updated</Badge>
                  <span className="text-gray-300">Сделка обновлена</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-300">deal.won</Badge>
                  <span className="text-gray-300">Сделка выиграна</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500/20 text-red-300">deal.lost</Badge>
                  <span className="text-gray-300">Сделка проиграна</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Setup */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Настройка Webhooks</CardTitle>
            <CardDescription className="text-gray-300">
              Создайте эндпоинт для получения уведомлений о событиях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">1. Создайте эндпоинт</h4>
                <p className="text-gray-300 mb-3">
                  Создайте HTTPS эндпоинт, который будет принимать POST запросы с данными о событиях.
                </p>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`app.post('/webhooks/rundex', (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'customer.created':
      console.log('Новый клиент:', data);
      break;
    case 'deal.won':
      console.log('Сделка выиграна:', data);
      break;
  }

  res.json({ status: 'received' });
});`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">2. Зарегистрируйте webhook</h4>
                <p className="text-gray-300 mb-3">
                  Используйте API для регистрации вашего эндпоинта в Rundex CRM.
                </p>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X POST "https://api.rundex.com/v1/webhooks" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourapp.com/webhooks/rundex",
    "events": ["customer.created", "deal.updated", "deal.won"],
    "secret": "your-webhook-secret"
  }'`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">3. Верификация подписи</h4>
                <p className="text-gray-300 mb-3">
                  Проверяйте подпись запросов для безопасности.
                </p>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`const crypto = require('crypto');

function verifyWebhook(req, secret) {
  const signature = req.headers['x-rundex-signature'];
  const payload = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expected;
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payload Examples */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Примеры payload</CardTitle>
            <CardDescription className="text-gray-300">
              Структура данных, отправляемых в webhook уведомлениях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">customer.created</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "event": "customer.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "id": "cust_12345",
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "company": "ООО Пример",
    "phone": "+7 (495) 123-4567",
    "created_at": "2025-01-15T10:30:00Z"
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">deal.won</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "event": "deal.won",
  "timestamp": "2025-01-15T14:20:00Z",
  "data": {
    "id": "deal_67890",
    "customer_id": "cust_12345",
    "amount": 150000,
    "currency": "RUB",
    "status": "won",
    "won_at": "2025-01-15T14:20:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Готовы настроить Webhooks?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Начните получать автоматические уведомления о важных событиях в вашем бизнесе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Получить помощь с настройкой
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
