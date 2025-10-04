import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="backdrop-blur-lg bg-black/20 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Rundex
              </span>
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
              <Link href="/premium" className="text-white hover:text-blue-400 transition-colors">
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
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30">
            Эксклюзивный уровень
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Premium Lux
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Максимальный уровень персонализации и функциональности для самых требовательных клиентов.
            Индивидуальные решения и премиум поддержка 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">От ₽59,900</div>
              <div className="text-gray-400">в месяц</div>
            </div>
          </div>

          {/* Exclusive Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="bg-purple-900/20 backdrop-blur-xl border-purple-400/30 hover:bg-purple-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Персональный AI Консультант
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Выделенный AI специалист, обученный на ваших бизнес-процессах и данных
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-blue-900/20 backdrop-blur-xl border-blue-400/30 hover:bg-blue-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Кастомная интеграция
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Полная интеграция с любыми существующими системами вашей компании
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-green-900/20 backdrop-blur-xl border-green-400/30 hover:bg-green-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Максимальная безопасность
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Корпоративный уровень защиты с шифрованием на уровне банковских стандартов
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-yellow-900/20 backdrop-blur-xl border-yellow-400/30 hover:bg-yellow-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Гибкое ценообразование
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Индивидуальные условия оплаты и скидки в зависимости от объема использования
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-red-900/20 backdrop-blur-xl border-red-400/30 hover:bg-red-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                  </svg>
                  Приоритетная поддержка
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Персональный менеджер поддержки с временем реакции менее 15 минут
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-indigo-900/20 backdrop-blur-xl border-indigo-400/30 hover:bg-indigo-900/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-indigo-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Расширенная аналитика
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Глубокий анализ данных с предиктивными моделями и кастомными отчетами
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Premium Benefits */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-400">Преимущества Premium Lux</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Персональный Success Manager */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 backdrop-blur-xl border-purple-400/30 hover:bg-purple-900/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/50">
                      Эксклюзивно
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-3">
                    Персональный Success Manager
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    Выделенный менеджер по успеху клиентов, который поможет оптимизировать использование платформы
                    и достигать максимальных результатов бизнеса.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Еженедельные консультации
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Анализ метрик и KPI
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Рекомендации по оптимизации
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Обучение команды
                      </div>
                    </div>
                    <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:scale-105 transition-all duration-300">
                        Выбрать этот пакет
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Корпоративная безопасность */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/10 backdrop-blur-xl border-blue-400/30 hover:bg-blue-900/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/50">
                      Максимальная защита
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-3">
                    Корпоративная безопасность
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    Максимальный уровень защиты данных с соответствием международным стандартам
                    безопасности и регулярными аудитами для Enterprise клиентов.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Шифрование AES-256
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        SOC 2 Type II
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Penetration тесты
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        2FA аутентификация
                      </div>
                    </div>
                    <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group-hover:scale-105 transition-all duration-300">
                        Выбрать этот пакет
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Продвинутый AI функционал */}
              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 backdrop-blur-xl border-green-400/30 hover:bg-green-900/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/50">
                      AI технологии
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-3">
                    Продвинутый AI функционал
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    Искусственный интеллект нового поколения, адаптированный под специфику вашего бизнеса
                    с возможностью обучения на внутренних данных компании.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Кастомные ML модели
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Авто-категоризация
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Предиктивная аналитика
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Автоматизация процессов
                      </div>
                    </div>
                    <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white group-hover:scale-105 transition-all duration-300">
                        Выбрать этот пакет
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Гибкие условия */}
              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 backdrop-blur-xl border-yellow-400/30 hover:bg-yellow-900/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/50">
                      Индивидуальный подход
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-3">
                    Гибкие условия
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    Индивидуальный подход к каждому клиенту с возможностью корректировки условий
                    контракта и предоставления дополнительных услуг по запросу.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Кастомные SLA
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Индивидуальные скидки
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Дополнительные услуги
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Гибкие платежи
                      </div>
                    </div>
                    <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white group-hover:scale-105 transition-all duration-300">
                        Выбрать этот пакет
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Готовы к премиум уровню?</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Свяжитесь с нами для получения персонального предложения и консультации по Premium Lux пакету
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8">
                    Получить предложение
                  </Button>
                  <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                    Запросить демо
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Консультация бесплатна • Персональный менеджер • Гибкие условия
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/60 backdrop-blur-xl border-t border-white/20 shadow-2xl">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
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
                  Когда Магистру скучно появляются стартапы - Когда он серьезен, они закрываются
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
