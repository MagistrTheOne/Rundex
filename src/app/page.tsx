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
          

 

          <h1 className="text-5xl md:text-8xl font-bold mb-8 text-white leading-tight tracking-tight">
            Управляйте бизнесом
            <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              интеллектуально
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Rundex — премиум CRM система с интеграцией AI нового поколения.
            Автоматизируйте процессы, анализируйте данные и управляйте клиентами
            с помощью передовых технологий.
          </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-10 py-8 text-xl font-semibold shadow-2xl border border-white/10 backdrop-blur-sm">
                🚀 Попробовать бесплатно 14 дней
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-10 py-8 text-xl font-semibold backdrop-blur-sm">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500 shadow-2xl group">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">
                  AI Автоматизация нового поколения
                </CardTitle>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  Передовые алгоритмы машинного обучения анализируют большие данные,
                  автоматизируют рутинные процессы и предсказывают тенденции рынка
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500 shadow-2xl group">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">
                  Аналитика в реальном времени
                </CardTitle>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  Мощная система аналитики с визуализацией данных в реальном времени,
                  предиктивной аналитикой и персонализированными отчетами
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500 shadow-2xl group">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">
                  Безопасность Enterprise уровня
                </CardTitle>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  Корпоративный уровень безопасности с шифрованием AES-256,
                  многофакторной аутентификацией и соответствием SOC 2 Type II
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* AI Demo Section */}
          <section className="mt-32 mb-20">
            <div className="max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-white/20 shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <CardTitle className="text-3xl font-bold text-white mb-4">
                    AI Ассистент в действии
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300 max-w-3xl mx-auto">
                    Наш AI анализирует данные клиентов, предсказывает тренды и автоматизирует рутинные задачи
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">AI Ассистент</p>
                            <p className="text-white">Проанализировал 10,000+ клиентских взаимодействий и выявил 3 ключевых тренда роста продаж на 45%</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">AI Аналитика</p>
                            <p className="text-white">Автоматически сгенерировал отчет о конверсии: рост на 23% после оптимизации воронки продаж</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">AI Безопасность</p>
                            <p className="text-white">Обнаружил и заблокировал 99.7% подозрительной активности в реальном времени</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>AI работает...</span>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-white text-sm">Анализ данных клиентов...</p>
                              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-white text-sm">Генерация инсайтов...</p>
                              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-white text-sm">Оптимизация процессов...</p>
                              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full animate-pulse" style={{width: '90%'}}></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center pt-4">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                              Попробовать AI демо
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group relative overflow-hidden">
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/10">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text">50,000+</div>
              <div className="text-gray-300 font-medium">Активных клиентов</div>
              <div className="text-sm text-gray-400 mt-1">По всему миру</div>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group relative overflow-hidden">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/10">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text">99.95%</div>
              <div className="text-gray-300 font-medium">SLA гарантия</div>
              <div className="text-sm text-gray-400 mt-1">Доступность сервиса</div>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group relative overflow-hidden">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/10">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text">&lt;25ms</div>
              <div className="text-gray-300 font-medium">Средний отклик</div>
              <div className="text-sm text-gray-400 mt-1">API response time</div>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group relative overflow-hidden">
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/10">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-300 font-medium">Премиум поддержка</div>
              <div className="text-sm text-gray-400 mt-1">Корпоративный уровень</div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/30 text-lg px-6 py-3">
              🚀 14 дней полного доступа
            </Badge>
            <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white leading-tight">
              Начните Enterprise уровень
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                бесплатно
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Получите полный доступ ко всем функциям Enterprise CRM с AI.
              Нет ограничений, кредитных карт или скрытых платежей.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 backdrop-blur-xl border border-emerald-400/30 hover:bg-emerald-900/30 transition-all duration-500 group">
              <CardHeader className="pb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-emerald-400 text-xl font-bold mb-4 text-center">
                  Мгновенный запуск
                </CardTitle>
                <CardDescription className="text-gray-300 text-center text-base leading-relaxed">
                  Полноценная настройка за 5 минут. Импорт данных, настройка процессов и обучение команды — всё автоматически
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-xl border border-blue-400/30 hover:bg-blue-900/30 transition-all duration-500 group">
              <CardHeader className="pb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-blue-400 text-xl font-bold mb-4 text-center">
                  Полный Enterprise функционал
                </CardTitle>
                <CardDescription className="text-gray-300 text-center text-base leading-relaxed">
                  Доступны все премиум функции: AI аналитика, кастомные интеграции, продвинутые отчеты и автоматизация
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-xl border border-purple-400/30 hover:bg-purple-900/30 transition-all duration-500 group">
              <CardHeader className="pb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle className="text-purple-400 text-xl font-bold mb-4 text-center">
                  Корпоративная безопасность
                </CardTitle>
                <CardDescription className="text-gray-300 text-center text-base leading-relaxed">
                  Шифрование AES-256, многофакторная аутентификация и соответствие SOC 2 Type II с первого дня использования
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-16 py-8 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20">
                🚀 Начать Enterprise триал
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 px-12 py-8 text-xl font-semibold backdrop-blur-sm">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-emerald-400 text-lg font-medium">
              ✓ Без кредитной карты • ✓ Полный Enterprise доступ • ✓ Отмена в любой момент
            </p>
            <p className="text-gray-400 text-sm">
              14 дней полного доступа ко всем функциям • Персональный AI ассистент • Корпоративная поддержка
            </p>
          </div>
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
      <footer className="py-16 px-4 bg-gradient-to-b from-transparent to-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-6 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Rundex</h3>
                  <p className="text-gray-400 text-sm">Enterprise CRM Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Ведущая платформа управления клиентскими отношениями с интеграцией
                искусственного интеллекта для корпоративных клиентов по всему миру.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.162 1.219-5.162s-.279-.558-.279-1.379c0-1.279.74-2.237 1.658-2.237.783 0 1.16.588 1.16 1.299 0 .787-.501 1.968-.759 3.063-.219.919.461 1.668 1.36 1.668 1.639 0 2.898-1.719 2.898-4.201 0-2.198-1.579-3.736-3.837-3.736-2.617 0-4.15 1.96-4.15 3.988 0 .787.301 1.631.679 2.088.078.099.099.179.079.279-.08.301-.24 1.04-.28 1.178-.04.179-.139.219-.321.139-1.199-.559-1.939-2.298-1.939-3.697 0-2.897 2.099-5.556 6.077-5.556 3.198 0 5.675 2.278 5.675 5.321 0 3.177-2.001 5.734-4.777 5.734-.939 0-1.818-.499-2.118-1.099 0 0-.479 1.838-.599 2.277-.219.859-.8 1.919-1.199 2.577C9.197 23.814 10.566 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Продукт</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Тарифные планы</Link></li>
                <li><Link href="/premium" className="hover:text-white transition-colors">Premium решения</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">О компании</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Демо-доступ</Link></li>
                <li><Link href="/enterprise" className="hover:text-white transition-colors">Корпоративные решения</Link></li>
              </ul>
            </div>

            {/* Documentation */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Документация</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="/docs/api" className="hover:text-white transition-colors">REST API</a></li>
                <li><a href="/docs/webhooks" className="hover:text-white transition-colors">Webhooks</a></li>
                <li><a href="/docs/sdk" className="hover:text-white transition-colors">JavaScript SDK</a></li>
                <li><a href="/docs/examples" className="hover:text-white transition-colors">Примеры интеграции</a></li>
                <li><a href="/docs/guides" className="hover:text-white transition-colors">Руководства</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Поддержка</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="/help" className="hover:text-white transition-colors">Центр помощи</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Статус сервисов</a></li>
                <li><a href="/community" className="hover:text-white transition-colors">Сообщество</a></li>
                <li><a href="/training" className="hover:text-white transition-colors">Обучение</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Связаться с нами</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Правовая информация</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Условия использования</a></li>
                <li><a href="/security" className="hover:text-white transition-colors">Безопасность</a></li>
                <li><a href="/gdpr" className="hover:text-white transition-colors">GDPR</a></li>
                <li><a href="/compliance" className="hover:text-white transition-colors">Соответствие стандартам</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div className="mb-4 md:mb-0">
                <p>© 2025 Rundex Corporation. Все права защищены.</p>
                <p className="mt-2">Предоставляем Enterprise решения для бизнеса по всему миру</p>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-gray-500">ISO 27001 сертифицировано</span>
                <span className="text-gray-500">SOC 2 Type II compliant</span>
                <span className="text-gray-500">GDPR ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
