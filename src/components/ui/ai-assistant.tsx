"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Здравствуйте! Я Володя, ваш AI-помощник по Rundex CRM. Я могу помочь вам разобраться с интерфейсом, ответить на вопросы о функциях и дать советы по эффективному использованию системы. Чем могу помочь?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    'привет': 'Здравствуйте! Рад вас видеть в Rundex CRM. Чем могу помочь сегодня?',
    'как добавить клиента': 'Чтобы добавить нового клиента, перейдите в раздел "Клиенты" и нажмите кнопку "Добавить клиента". Заполните основную информацию: имя, email, телефон и компанию. Можно также добавить заметки и теги для удобства поиска.',
    'как посмотреть аналитику': 'Аналитика доступна в разделе "Аналитика" главного меню. Там вы увидите графики продаж, конверсию воронки и KPI метрики. Используйте фильтры по датам для детального анализа.',
    'что такое ai инсайты': 'AI инсайты - это интеллектуальные рекомендации на основе анализа ваших данных. Система анализирует поведение клиентов, продажи и предлагает оптимизации. Например, может посоветовать изменить стратегию маркетинга или выделить перспективных клиентов.',
    'как настроить интеграцию': 'Для настройки интеграций перейдите в "Настройки" → "Интеграции". Выберите нужный сервис (email, календарь, CRM) и следуйте инструкциям. Большинство интеграций настраиваются за 2-3 клика.',
    'где посмотреть отчеты': 'Отчеты находятся в разделе "Аналитика" → "Отчеты". Там можно создать кастомные отчеты по клиентам, продажам и активности. Все отчеты можно экспортировать в PDF или Excel.',
    'как изменить тариф': 'Для смены тарифа перейдите на страницу "Цены" и выберите подходящий план. При апгрейде разница рассчитается автоматически, при даунгрейде изменения вступят в силу со следующего периода.',
    'что делать если забыл пароль': 'Нажмите "Войти" и выберите "Забыли пароль?". Введите email и следуйте инструкциям для восстановления доступа. Если проблемы продолжаются, свяжитесь с поддержкой.',
    'как экспортировать данные': 'Экспорт доступен в разделе "Клиенты" → "Экспорт". Выберите формат (CSV, Excel) и нужные поля. Процесс занимает от нескольких секунд до минуты в зависимости от объема данных.',
    'помоги': 'Конечно! Расскажите подробнее, с чем именно нужна помощь. Я могу помочь с навигацией по интерфейсу, объяснить функции или дать советы по использованию CRM системы.'
  };

  const findBestMatch = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Ищем точные совпадения ключевых слов
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Если не нашли точное совпадение, ищем частичные совпадения
    for (const [key, response] of Object.entries(knowledgeBase)) {
      const keyWords = key.split(' ');
      const hasMatch = keyWords.some(word => lowerMessage.includes(word));
      if (hasMatch) {
        return response;
      }
    }

    // Дефолтные ответы для неизвестных вопросов
    const defaultResponses = [
      'Интересный вопрос! Позвольте мне найти информацию об этом в документации... Могу рассказать о добавлении клиентов, аналитике или настройках. Что конкретно вас интересует?',
      'Хороший вопрос! Я специализируюсь на помощи с интерфейсом Rundex CRM. Могу помочь с клиентами, аналитикой, интеграциями или отчетами. Расскажите подробнее!',
      'Отличный вопрос! Я ваш персональный гид по Rundex CRM. Задайте вопрос о любой функции - от управления клиентами до аналитики продаж, и я постараюсь помочь!'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Симуляция обработки запроса AI
    setTimeout(() => {
      const response = findBestMatch(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // 1-2.5 секунды
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl z-50"
        size="lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
        </svg>
      </Button>

      {/* AI Assistant Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">В</span>
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Володя</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    AI помощник по Rundex CRM
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96 px-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs mt-1 block ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-100 p-3 rounded-lg max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задайте вопрос о Rundex CRM..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>

              {/* Quick Questions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 text-gray-300 border-gray-600"
                  onClick={() => setInputMessage('Как добавить клиента?')}
                >
                  Добавить клиента
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 text-gray-300 border-gray-600"
                  onClick={() => setInputMessage('Как посмотреть аналитику?')}
                >
                  Аналитика
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 text-gray-300 border-gray-600"
                  onClick={() => setInputMessage('Что такое AI инсайты?')}
                >
                  AI инсайты
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
