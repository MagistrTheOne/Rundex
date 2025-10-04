"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function DashboardPage() {
  const [aiInsight] = useState("На основе анализа данных за последний месяц, рекомендую увеличить бюджет на контекстную рекламу на 15%. Это может повысить конверсию на 8-12%.");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="backdrop-blur-lg bg-black/20 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Rundex CRM
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Главная
              </Link>
              <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors">
                Дашборд
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Цены
              </Link>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Профиль
              </Button>
            </div>

            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner for Trial Users */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl border-green-400/30 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">
                🎉 Добро пожаловать в Rundex CRM!
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                У вас есть 14 дней полного доступа ко всем функциям Enterprise CRM.
                Начните управлять клиентами, аналитикой и бизнес-процессами прямо сейчас!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">14 дней бесплатно</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-semibold">Полный доступ</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold">Быстрый старт</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h1 className="text-3xl font-bold mb-2">Панель управления Rundex CRM</h1>
          <p className="text-gray-400">Управляйте клиентами, аналитикой и бизнес-процессами</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Обзор</TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-white/10">Клиенты</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">Аналитика</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-white/10">AI Инсайты</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Всего клиентов</CardTitle>
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2,847</div>
                  <p className="text-xs text-green-400">+12% от прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Доход</CardTitle>
                  <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">₽1,234,567</div>
                  <p className="text-xs text-green-400">+8% от прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Конверсия</CardTitle>
                  <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">24.8%</div>
                  <p className="text-xs text-red-400">-2% от прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Активные сделки</CardTitle>
                  <svg className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">156</div>
                  <p className="text-xs text-green-400">+18% от прошлого месяца</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Недавние активности</CardTitle>
                  <CardDescription className="text-gray-400">Последние действия клиентов</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Новый клиент зарегистрирован</p>
                      <p className="text-xs text-gray-400">ООО "ТехноСофт" • 2 минуты назад</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Сделка закрыта</p>
                      <p className="text-xs text-gray-400">₽450,000 • 15 минут назад</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Новое сообщение поддержки</p>
                      <p className="text-xs text-gray-400">Вопрос по интеграции • 1 час назад</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Цели продаж</CardTitle>
                  <CardDescription className="text-gray-400">Прогресс за текущий месяц</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Квартальная цель</span>
                      <span className="text-white">₽3.2M / ₽4.0M</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Новые клиенты</span>
                      <span className="text-white">847 / 1000</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Конверсия лидов</span>
                      <span className="text-white">24.8% / 25%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Управление клиентами</CardTitle>
                <CardDescription className="text-gray-400">Список клиентов и их статус</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((client) => (
                    <div key={client} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">C{client}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Клиент {client}</p>
                          <p className="text-gray-400 text-sm">client{client}@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                          Активный
                        </Badge>
                        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Доходы по месяцам</CardTitle>
                  <CardDescription className="text-gray-400">График доходов за год</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    График доходов (Chart.js интеграция)
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Конверсия воронки</CardTitle>
                  <CardDescription className="text-gray-400">Этапы продаж</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Лиды</span>
                      <span className="text-white">1,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Квалифицированные</span>
                      <span className="text-white">750</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Предложения</span>
                      <span className="text-white">300</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Сделки</span>
                      <span className="text-white">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-purple-900/20 backdrop-blur-xl border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Инсайты и Рекомендации
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Интеллектуальный анализ данных и персонализированные рекомендации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-white/5 rounded-lg border border-purple-400/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white mb-2">{aiInsight}</p>
                      <div className="flex items-center space-x-4">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          Применить рекомендацию
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Предиктивная аналитика</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Прогноз продаж на следующий квартал с вероятностью 94%
                    </p>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Автоматизация процессов</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      23 процесса оптимизированы, экономия времени: 45 часов/месяц
                    </p>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trial CTA */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-blue-400/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">
                Готовы продолжить работу с Rundex?
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Не упустите возможность получить постоянный доступ к премиум CRM системе
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">Осталось 12 дней</div>
                  <div className="text-gray-400 text-sm">бесплатного триала</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">Выберите тариф</div>
                  <div className="text-gray-400 text-sm">от ₽4,900/месяц</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                    Посмотреть тарифы
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                    Premium возможности
                  </Button>
                </Link>
              </div>

              <p className="text-gray-400 text-sm mt-4">
                💡 После триала все данные сохранятся при переходе на платный тариф
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
