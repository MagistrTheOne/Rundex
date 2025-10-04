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
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Персональный Success Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Выделенный менеджер по успеху клиентов, который поможет оптимизировать использование платформы
                    и достигать максимальных результатов.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Еженедельные консультации</li>
                    <li>• Анализ метрик и KPI</li>
                    <li>• Рекомендации по оптимизации</li>
                    <li>• Обучение команды</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    Корпоративная безопасность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Максимальный уровень защиты данных с соответствием международным стандартам
                    безопасности и регулярными аудитами.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Шифрование AES-256</li>
                    <li>• Соответствие SOC 2 Type II</li>
                    <li>• Регулярные penetration тесты</li>
                    <li>• Многофакторная аутентификация</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    Продвинутый AI функционал
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Искусственный интеллект, адаптированный под специфику вашего бизнеса
                    с возможностью обучения на внутренних данных.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Кастомные модели машинного обучения</li>
                    <li>• Автоматическая категоризация данных</li>
                    <li>• Предиктивная аналитика</li>
                    <li>• Автоматизация сложных процессов</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    Гибкие условия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Индивидуальный подход к каждому клиенту с возможностью корректировки условий
                    контракта и дополнительных услуг.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Кастомные SLA соглашения</li>
                    <li>• Индивидуальные скидки</li>
                    <li>• Дополнительные услуги</li>
                    <li>• Гибкие сроки оплаты</li>
                  </ul>
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
      <footer className="py-12 px-4 bg-black/50 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">Rundex</span>
            </div>
            <p className="text-gray-400 text-sm">
              Премиум CRM система с интеграцией AI для современного бизнеса
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 Rundex. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
