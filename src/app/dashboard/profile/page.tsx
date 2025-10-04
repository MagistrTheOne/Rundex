// Rundex CRM - Страница профиля пользователя
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Trophy,
  Star,
  Crown,
  Camera,
  Save,
  Upload,
  Eye,
  EyeOff
} from "lucide-react"
import { motion } from "framer-motion"

const themes = [
  { id: 'dark', name: 'Темная', color: '#000000' },
  { id: 'purple', name: 'Фиолетовая', color: '#7B61FF' },
  { id: 'blue', name: 'Синяя', color: '#3B82F6' },
  { id: 'green', name: 'Зеленая', color: '#10B981' },
  { id: 'orange', name: 'Оранжевая', color: '#F59E0B' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [selectedTheme, setSelectedTheme] = useState('purple')

  const tabs = [
    { id: 'personal', label: 'Личные данные', icon: User },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'achievements', label: 'Достижения', icon: Trophy },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Заголовок */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Профиль пользователя</h1>
          <p className="text-white/70 mt-1">Настройте свой профиль и предпочтения</p>
        </div>
        <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
          <Save className="w-4 h-4 mr-2" />
          Сохранить изменения
        </Button>
      </motion.div>

      {/* Навигация по табам */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex space-x-1 bg-black/20 backdrop-blur-xl p-1 rounded-lg border border-white/10"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#7B61FF] text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Контент табов */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Основной контент */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'personal' && <PersonalInfo />}
          {activeTab === 'appearance' && <AppearanceSettings selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'achievements' && <AchievementsView />}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          <ProfileCard />
          <QuickStats />
          <RecentActivity />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Компоненты для каждого таба
function PersonalInfo() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Личные данные
        </CardTitle>
        <CardDescription className="text-white/70">
          Обновите информацию о себе
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-[#7B61FF]/50">
              <AvatarImage src="/avatars/admin.png" alt="Профиль" />
              <AvatarFallback className="bg-[#7B61FF]/20 text-white text-2xl">АС</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-[#7B61FF] hover:bg-[#6B51EF]"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="border-[#7B61FF]/50 text-[#7B61FF] hover:bg-[#7B61FF]/10">
              <Upload className="w-4 h-4 mr-2" />
              Загрузить фото
            </Button>
            <p className="text-xs text-white/50">
              JPG, PNG или GIF. Макс. 5MB
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">Имя</Label>
            <Input
              id="firstName"
              defaultValue="Администратор"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">Фамилия</Label>
            <Input
              id="lastName"
              defaultValue="Системы"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="admin@rundex.ru"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Телефон</Label>
            <Input
              id="phone"
              defaultValue="+7 (999) 123-45-67"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position" className="text-white">Должность</Label>
            <Input
              id="position"
              defaultValue="Администратор"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-white">Отдел</Label>
            <Select defaultValue="sales">
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Продажи</SelectItem>
                <SelectItem value="marketing">Маркетинг</SelectItem>
                <SelectItem value="support">Поддержка</SelectItem>
                <SelectItem value="management">Управление</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">О себе</Label>
          <Textarea
            id="bio"
            placeholder="Расскажите о себе..."
            defaultValue="Опытный менеджер с 5+ годами работы в сфере продаж. Специализируюсь на B2B решениях."
            className="bg-white/5 border-white/20 text-white min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function AppearanceSettings({ selectedTheme, onThemeChange }: { selectedTheme: string, onThemeChange: (theme: string) => void }) {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Внешний вид
        </CardTitle>
        <CardDescription className="text-white/70">
          Настройте внешний вид интерфейса
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Тема оформления</h3>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTheme === theme.id
                    ? 'border-[#7B61FF] bg-[#7B61FF]/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div
                  className="w-full h-12 rounded mb-2"
                  style={{ backgroundColor: theme.color }}
                />
                <p className="text-white text-sm font-medium">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Настройки интерфейса</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Компактный режим</p>
                <p className="text-white/60 text-sm">Уменьшает отступы и размеры элементов</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Анимации</p>
                <p className="text-white/60 text-sm">Включает плавные переходы и эффекты</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Показывать подсказки</p>
                <p className="text-white/60 text-sm">Отображает всплывающие подсказки</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationSettings() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Уведомления
        </CardTitle>
        <CardDescription className="text-white/70">
          Настройте получение уведомлений
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push-уведомления</p>
              <p className="text-white/60 text-sm">Уведомления в браузере</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email-уведомления</p>
              <p className="text-white/60 text-sm">Ежедневные отчеты на email</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Уведомления от Володи</p>
              <p className="text-white/60 text-sm">AI-комментарии и советы</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Звуковые эффекты</p>
              <p className="text-white/60 text-sm">Звуки при получении уведомлений</p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SecuritySettings() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Безопасность
        </CardTitle>
        <CardDescription className="text-white/70">
          Настройки безопасности аккаунта
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">Текущий пароль</Label>
            <Input
              id="currentPassword"
              type="password"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">Новый пароль</Label>
            <Input
              id="newPassword"
              type="password"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Подтверждение пароля</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
            Изменить пароль
          </Button>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Двухфакторная аутентификация</p>
              <p className="text-white/60 text-sm">Дополнительная защита аккаунта</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Автоматический выход</p>
              <p className="text-white/60 text-sm">Выходить из системы через 30 минут бездействия</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AchievementsView() {
  const achievements = [
    { id: 'first_lead', title: 'Первый лид', earned: true, rarity: 'common' },
    { id: 'deal_master', title: 'Мастер сделок', earned: true, rarity: 'rare' },
    { id: 'volodya_friend', title: 'Друг Володи', earned: true, rarity: 'epic' },
    { id: 'productivity_hero', title: 'Герой продуктивности', earned: false, rarity: 'legendary' },
  ]

  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Достижения
        </CardTitle>
        <CardDescription className="text-white/70">
          Ваши достижения в работе с CRM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border backdrop-blur-sm ${
                achievement.earned
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-500/10 border-gray-500/30 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  achievement.earned
                    ? 'bg-green-500/20'
                    : 'bg-gray-500/20'
                }`}>
                  <Trophy className={`w-5 h-5 ${
                    achievement.earned
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-white' : 'text-white/50'
                    }`}>
                      {achievement.title}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${
                      achievement.rarity === 'legendary' ? 'border-yellow-500/50 text-yellow-400' :
                      achievement.rarity === 'epic' ? 'border-purple-500/50 text-purple-400' :
                      achievement.rarity === 'rare' ? 'border-blue-500/50 text-blue-400' :
                      'border-gray-500/50 text-gray-400'
                    }`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className={`text-sm mt-1 ${
                    achievement.earned ? 'text-white/70' : 'text-white/40'
                  }`}>
                    {achievement.earned ? 'Получено' : 'Не получено'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileCard() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          <Avatar className="w-20 h-20 mx-auto border-2 border-[#7B61FF]/50">
            <AvatarImage src="/avatars/admin.png" alt="Профиль" />
            <AvatarFallback className="bg-[#7B61FF]/20 text-white text-xl">АС</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#7B61FF] rounded-full flex items-center justify-center border-2 border-black">
            <Crown className="w-3 h-3 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Администратор Системы</h3>
        <p className="text-white/70 mb-2">Мастер продаж • Уровень 15</p>
        <div className="space-y-2">
          <Progress value={75} className="w-full h-2" />
          <p className="text-xs text-white/50">2850 / 3200 XP</p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickStats() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Быстрая статистика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-[#7B61FF]">3</div>
            <div className="text-xs text-white/60">Достижения</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-green-400">85</div>
            <div className="text-xs text-white/60">Очки</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Недавняя активность</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Получено достижение "Друг Володи"</p>
              <p className="text-white/50 text-xs">2 часа назад</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Обновлен профиль</p>
              <p className="text-white/50 text-xs">Вчера</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Завершен ежедневный вызов</p>
              <p className="text-white/50 text-xs">3 дня назад</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
