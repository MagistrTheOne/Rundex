import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function DocsPage() {
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
            Центр документации
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">Документация Rundex CRM</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Полная документация по использованию Rundex CRM, API интеграции,
            настройкам и передовым практикам для максимальной эффективности.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                REST API
              </CardTitle>
              <CardDescription className="text-gray-300">
                Полноценное REST API для интеграции с внешними системами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/api">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Перейти к API
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Webhooks
              </CardTitle>
              <CardDescription className="text-gray-300">
                Автоматические уведомления о событиях в реальном времени
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/webhooks">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Настроить Webhooks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                JavaScript SDK
              </CardTitle>
              <CardDescription className="text-gray-300">
                Готовые библиотеки для быстрой интеграции с веб-приложениями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/sdk">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Скачать SDK
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Примеры кода
              </CardTitle>
              <CardDescription className="text-gray-300">
                Готовые примеры интеграции для популярных фреймворков
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/examples">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть примеры
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Руководство пользователя
              </CardTitle>
              <CardDescription className="text-gray-300">
                Подробное руководство по использованию всех функций CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/user-guide">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Читать руководство
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-indigo-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Миграция данных
              </CardTitle>
              <CardDescription className="text-gray-300">
                Инструкции по переносу данных из других CRM систем
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs/migration">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Начать миграцию
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Быстрый старт</CardTitle>
            <CardDescription className="text-gray-300">
              Начните работу с Rundex CRM за 5 минут
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-lg">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Создайте аккаунт</h3>
                <p className="text-gray-400 text-sm">Зарегистрируйтесь и получите доступ к демо</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 font-bold text-lg">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Добавьте клиентов</h3>
                <p className="text-gray-400 text-sm">Импортируйте или создайте базу клиентов</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-400 font-bold text-lg">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Начните продажи</h3>
                <p className="text-gray-400 text-sm">Отслеживайте сделки и анализируйте результаты</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support CTA */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Нужна помощь с документацией?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Наша команда технической поддержки поможет разобраться с любыми вопросами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Связаться с поддержкой
                </Button>
              </a>
              <Link href="/status">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Статус сервиса
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
