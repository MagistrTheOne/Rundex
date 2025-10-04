import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function AboutPage() {
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
              <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/30">
              О компании
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Инновации в управлении бизнесом
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Rundex — это не просто CRM система, это интеллектуальная платформа,
              которая трансформирует подход к управлению клиентскими отношениями
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Наша история</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Компания Rundex была основана в 2025 году solo full stack разработчиком MagistrTheOne
                из Краснодара. За одну неделю был создан полнофункциональный продукт уровня Enterprise,
                сочетающий современные технологии и практический опыт разработки 7+ лет.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Проект стартовал с глубокого анализа рыночных потребностей и выявления пробелов
                в существующих CRM решениях. Традиционные системы не справлялись с вызовами
                современной бизнес-среды: большими объемами данных, автоматизацией процессов
                и необходимостью AI-интеграции.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Так родилась Rundex — инновационная платформа, сочетающая в себе
                мощь искусственного интеллекта, простоту использования и корпоративный
                уровень безопасности. Проект демонстрирует возможности быстрой разработки
                качественных решений одним специалистом.
              </p>
            </div>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Ключевые этапы развития</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Январь 2025 — Концепция и анализ рынка</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Февраль 2025 — Прототипирование и дизайн</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Март 2025 — Полноценная разработка</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Апрель 2025 — Тестирование и оптимизация</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Май 2025 — Запуск и демонстрация</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-400">Наши ценности</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Инновации
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Мы постоянно внедряем новейшие технологии и подходы для создания лучших решений
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Надежность
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Гарантируем 99.9% uptime и безопасность данных корпоративного уровня
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Клиентоориентированность
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Каждый клиент важен для нас. Мы стремимся к долгосрочным партнерствам
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">Команда</h2>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-center">
                <CardHeader>
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">M1</span>
                  </div>
                  <CardTitle className="text-white text-2xl">MagistrTheOne</CardTitle>
                  <CardDescription className="text-gray-300">Solo Full Stack Developer & Founder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="text-left">
                      <p className="text-gray-400 mb-2">📍 Локация:</p>
                      <p className="text-white">Краснодар, Россия</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 mb-2">📅 Год основания:</p>
                      <p className="text-white">2025</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 mb-2">💼 Опыт:</p>
                      <p className="text-white">7+ лет разработки</p>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 mb-2">🚀 Специализация:</p>
                      <p className="text-white">Full Stack Development</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <a href="https://github.com/MagistrTheOne/" target="_blank" rel="noopener noreferrer"
                       className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      GitHub
                    </a>
                    <a href="https://t.me/MagistrTheOne" target="_blank" rel="noopener noreferrer"
                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Telegram
                    </a>
                    <a href="mailto:maxonyushko71@gmail.com"
                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Email
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Solo разработчик, создавший полнофункциональную Enterprise CRM за одну неделю
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mission Section */}
          <section className="text-center">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Наша миссия</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Создавать инновационные решения, которые помогают бизнесу расти и процветать в цифровую эпоху
                </CardDescription>
              </CardHeader>
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
