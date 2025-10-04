import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-black/30 border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-black to-purple-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Rundex
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-blue-400 transition-colors">
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="mb-8">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30">
            Enterprise CRM с AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Управляйте бизнесом
            <br />
            <span className="text-blue-400">интеллектуально</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Rundex — премиум CRM система с интеграцией AI для автоматизации процессов,
            аналитики и управления клиентами.
          </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                Попробовать бесплатно
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Автоматизация
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Интеллектуальные алгоритмы анализируют данные и автоматизируют рутинные процессы
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Аналитика в реальном времени
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Мощная система аналитики с визуализацией данных и предиктивной аналитикой
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Безопасность Enterprise
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Корпоративный уровень безопасности с шифрованием данных и многофакторной аутентификацией
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
              <div className="text-gray-300">Клиентов</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">50ms</div>
              <div className="text-gray-300">Отклик</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-12">
            <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-400/30 text-lg px-4 py-2">
              14 дней бесплатно
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Начните использовать Rundex
              <br />
              <span className="text-green-400">прямо сейчас</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Не нужно ждать — начните работу с Rundex CRM уже сегодня.
              Получите полный доступ ко всем функциям на 14 дней абсолютно бесплатно.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2 justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Быстрый старт
                </CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Начните работу за 5 минут без сложной настройки
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2 justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Полный функционал
                </CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Все возможности Enterprise CRM доступны сразу
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2 justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Безопасность
                </CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Корпоративный уровень защиты ваших данных
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300">
                🚀 Попробовать бесплатно 14 дней
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
              Посмотреть демо
            </Button>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Без кредитной карты • Полный доступ • Отмена в любой момент
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Готовы начать?</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Присоединяйтесь к тысячам компаний, которые уже используют Rundex для роста бизнеса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Попробовать бесплатно
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Связаться с нами
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/60 backdrop-blur-xl border-t border-white/20 shadow-2xl">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-white">Rundex</span>
              </div>
              <p className="text-gray-400 text-sm">
                Премиум CRM система с интеграцией AI для современного бизнеса.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/pricing" className="hover:text-white">Цены</Link></li>
                <li><Link href="/premium" className="hover:text-white">Премиум</Link></li>
                <li><Link href="/about" className="hover:text-white">О нас</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Дашборд</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Документация API</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/docs/api" className="hover:text-white">REST API</a></li>
                <li><a href="/docs/webhooks" className="hover:text-white">Webhooks</a></li>
                <li><a href="/docs/sdk" className="hover:text-white">JavaScript SDK</a></li>
                <li><a href="/docs/examples" className="hover:text-white">Примеры кода</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/docs" className="hover:text-white">Документация</a></li>
                <li><a href="/status" className="hover:text-white">Статус сервиса</a></li>
                <li><a href="/help" className="hover:text-white">Центр помощи</a></li>
                <li><a href="/community" className="hover:text-white">Сообщество</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:maxonyushko71@gmail.com" className="hover:text-white">maxonyushko71@gmail.com</a></li>
                <li><a href="https://t.me/MagistrTheOne" className="hover:text-white">Telegram</a></li>
                <li><a href="https://github.com/MagistrTheOne/" className="hover:text-white">GitHub</a></li>
                <li>Краснодар, Россия</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div className="mb-4 md:mb-0">
                © 2025 Rundex. Все права защищены.
                <div className="text-xs text-gray-500 mt-1 italic">
                  Когда Магистру скучно появляются стартапы - Когда он серьезен, они закрываются.
                </div>
              </div>
              <div className="flex space-x-6">
                <a href="/privacy" className="hover:text-white">Политика конфиденциальности</a>
                <a href="/terms" className="hover:text-white">Условия использования</a>
                <a href="/security" className="hover:text-white">Безопасность</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
