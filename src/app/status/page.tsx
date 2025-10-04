import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function StatusPage() {
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
            Статус сервиса
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">Статус Rundex CRM</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Мониторинг доступности сервисов Rundex CRM в реальном времени.
            Здесь вы можете проверить статус API, веб-интерфейса и других компонентов.
          </p>
        </div>

        {/* Overall Status */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">Общий статус системы</CardTitle>
                <CardDescription className="text-gray-300">
                  Последнее обновление: {new Date().toLocaleString('ru-RU')}
                </CardDescription>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/50 text-lg px-4 py-2">
                Все системы работают
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">API</h3>
                <p className="text-green-400 text-sm">99.9% uptime</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Веб-интерфейс</h3>
                <p className="text-green-400 text-sm">99.8% uptime</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">База данных</h3>
                <p className="text-green-400 text-sm">99.95% uptime</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">CDN</h3>
                <p className="text-green-400 text-sm">99.99% uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                API Endpoints
              </CardTitle>
              <CardDescription className="text-gray-300">
                Статус REST API эндпоинтов для интеграции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">/api/v1/customers</span>
                  <Badge className="bg-green-500/20 text-green-300">Оперативен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">/api/v1/deals</span>
                  <Badge className="bg-green-500/20 text-green-300">Оперативен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">/api/v1/analytics</span>
                  <Badge className="bg-green-500/20 text-green-300">Оперативен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">/api/v1/webhooks</span>
                  <Badge className="bg-green-500/20 text-green-300">Оперативен</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Веб-интерфейс
              </CardTitle>
              <CardDescription className="text-gray-300">
                Доступность веб-приложения и связанных сервисов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Основной сайт</span>
                  <Badge className="bg-green-500/20 text-green-300">Доступен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Дашборд</span>
                  <Badge className="bg-green-500/20 text-green-300">Доступен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Документация</span>
                  <Badge className="bg-green-500/20 text-green-300">Доступна</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Статус-страница</span>
                  <Badge className="bg-green-500/20 text-green-300">Доступна</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uptime History */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">История доступности</CardTitle>
            <CardDescription className="text-gray-300">
              Статистика uptime за последние 30 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                <div className="text-gray-400">API доступность</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99.8%</div>
                <div className="text-gray-400">Веб-интерфейс</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99.95%</div>
                <div className="text-gray-400">База данных</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Times */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Время отклика</CardTitle>
            <CardDescription className="text-gray-300">
              Среднее время ответа сервисов за последние 24 часа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">45ms</div>
                <div className="text-gray-400">API отклик</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">120ms</div>
                <div className="text-gray-400">Загрузка страницы</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">25ms</div>
                <div className="text-gray-400">База данных</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">15ms</div>
                <div className="text-gray-400">CDN</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Проблемы с доступом?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Если вы испытываете проблемы с доступом к сервисам, свяжитесь с нашей поддержкой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Сообщить о проблеме
                </Button>
              </a>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Центр помощи
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
