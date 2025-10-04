import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingData = {
    starter: {
      monthly: { price: 4900, originalPrice: 4900 },
      annual: { price: 3920, originalPrice: 4900, savings: "20%" }
    },
    professional: {
      monthly: { price: 12900, originalPrice: 12900 },
      annual: { price: 10320, originalPrice: 12900, savings: "20%" }
    },
    enterprise: {
      monthly: { price: 29900, originalPrice: 29900 },
      annual: { price: 23920, originalPrice: 29900, savings: "20%" }
    }
  };

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
              <Link href="/pricing" className="text-white hover:text-blue-400 transition-colors">
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
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 border-green-400/30">
            Гибкие тарифы
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            От стартапа до корпорации — найдите идеальное решение для вашего бизнеса с гибкой системой ценообразования
          </p>

          {isAnnual && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg max-w-md mx-auto">
              <p className="text-green-400 text-center">
                🎉 Ежегодная оплата — экономьте до 20% на всех тарифах!
              </p>
            </div>
          )}

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Ежемесячно</span>
            <Button
              variant="outline"
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 ${isAnnual ? 'bg-blue-600 border-blue-500' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              Ежегодно
              {isAnnual && <Badge className="ml-2 bg-green-500 text-white">Скидка 20%</Badge>}
            </Button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Starter</CardTitle>
                <CardDescription className="text-gray-300">Для начинающих команд</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-green-400">
                    ₽{isAnnual ? pricingData.starter.annual.price.toLocaleString() : pricingData.starter.monthly.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/месяц</span>
                </div>
                <div className="text-sm text-gray-400">
                  или ₽{isAnnual ? (pricingData.starter.annual.price * 12).toLocaleString() : (pricingData.starter.monthly.price * 12).toLocaleString()} ежегодно
                  {isAnnual && pricingData.starter.annual.savings && (
                    <Badge className="ml-2 bg-green-500 text-white">Экономия {pricingData.starter.annual.savings}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">До 1,000 контактов</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Базовая аналитика</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Email поддержка</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">API доступ</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">5 пользователей</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-6">
                  Начать бесплатно
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 relative ring-2 ring-blue-400/50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1">Популярный</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Professional</CardTitle>
                <CardDescription className="text-gray-300">Для растущих компаний</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-400">
                    ₽{isAnnual ? pricingData.professional.annual.price.toLocaleString() : pricingData.professional.monthly.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/месяц</span>
                </div>
                <div className="text-sm text-gray-400">
                  или ₽{isAnnual ? (pricingData.professional.annual.price * 12).toLocaleString() : (pricingData.professional.monthly.price * 12).toLocaleString()} ежегодно
                  {isAnnual && pricingData.professional.annual.savings && (
                    <Badge className="ml-2 bg-green-500 text-white">Экономия {pricingData.professional.annual.savings}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">До 10,000 контактов</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Расширенная аналитика</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Базовый AI ассистент</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">25 пользователей</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Интеграции</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-6">
                  Попробовать 14 дней
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
                <CardDescription className="text-gray-300">Для крупных организаций</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-400">
                    ₽{isAnnual ? pricingData.enterprise.annual.price.toLocaleString() : pricingData.enterprise.monthly.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/месяц</span>
                </div>
                <div className="text-sm text-gray-400">
                  или ₽{isAnnual ? (pricingData.enterprise.annual.price * 12).toLocaleString() : (pricingData.enterprise.monthly.price * 12).toLocaleString()} ежегодно
                  {isAnnual && pricingData.enterprise.annual.savings && (
                    <Badge className="ml-2 bg-green-500 text-white">Экономия {pricingData.enterprise.annual.savings}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Безлимитные контакты</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Полный AI функционал</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Персональный менеджер</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">SLA 99.9%</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Безлимитные пользователи</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Кастомные интеграции</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-6">
                  Связаться с нами
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-400">Часто задаваемые вопросы</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Можно ли изменить тариф в любое время?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Да, вы можете изменить тариф в любой момент. При апгрейде разница будет рассчитана пропорционально оставшемуся времени.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Есть ли пробный период?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Да, мы предлагаем 14-дневный пробный период для тарифа Professional без ограничений функционала.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Какие способы оплаты поддерживаются?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Мы принимаем банковские карты, банковские переводы и криптовалюту. Для Enterprise клиентов возможны индивидуальные условия.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Предоставляете ли вы скидки?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Да, мы предлагаем скидки для некоммерческих организаций, стартапов и при ежегодной оплате (до 20% экономии).
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Нужна помощь с выбором?</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Наша команда поможет подобрать оптимальное решение для вашего бизнеса
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8">
                    Получить консультацию
                  </Button>
                  <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                    Посмотреть демо
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>
    </div>
  );
}
