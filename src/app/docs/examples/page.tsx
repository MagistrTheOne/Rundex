import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import Link from "next/link";

export default function ExamplesPage() {
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
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
            Примеры кода
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-white">Готовые примеры интеграции</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Рабочие примеры интеграции Rundex CRM с популярными фреймворками и технологиями.
            Скопируйте код и адаптируйте под свои нужды.
          </p>
        </div>

        {/* Framework Examples */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                React
              </CardTitle>
              <CardDescription className="text-gray-300">
                Интеграция с React приложениями и хуками
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#react-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
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
                Vue.js
              </CardTitle>
              <CardDescription className="text-gray-300">
                Примеры для Vue.js приложений и Composition API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#vue-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
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
                Angular
              </CardTitle>
              <CardDescription className="text-gray-300">
                Интеграция с Angular сервисами и компонентами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#angular-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Node.js
              </CardTitle>
              <CardDescription className="text-gray-300">
                Серверная интеграция с Express и другими фреймворками
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#nodejs-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
                PHP
              </CardTitle>
              <CardDescription className="text-gray-300">
                Интеграция с PHP приложениями и Laravel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#php-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-indigo-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Python
              </CardTitle>
              <CardDescription className="text-gray-300">
                Интеграция с Python приложениями и Django/FastAPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#python-example">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Посмотреть пример
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Примеры кода</CardTitle>
            <CardDescription className="text-gray-300">
              Готовые решения для различных технологий и фреймворков
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">

              {/* React Example */}
              <div id="react-example" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  React + TypeScript
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`// components/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { RundexCRM } from '@rundex/crm-sdk';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const crm = new RundexCRM({
      apiKey: process.env.REACT_APP_RUNDEX_API_KEY!,
    });

    crm.customers.list({ limit: 50 })
      .then(data => {
        setCustomers(data.customers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки клиентов:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка клиентов...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map(customer => (
        <div key={customer.id} className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold">{customer.name}</h3>
          <p className="text-gray-300 text-sm">{customer.email}</p>
          <p className="text-gray-400 text-sm">{customer.company}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;`}
                  </pre>
                </div>
              </div>

              {/* Vue.js Example */}
              <div id="vue-example" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Vue.js + Composition API
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`// composables/useRundexCRM.ts
import { ref, onMounted } from 'vue';
import { RundexCRM } from '@rundex/crm-sdk';

export function useRundexCRM() {
  const customers = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const crm = new RundexCRM({
    apiKey: import.meta.env.VITE_RUNDEX_API_KEY,
  });

  const fetchCustomers = async () => {
    try {
      loading.value = true;
      const response = await crm.customers.list({ limit: 100 });
      customers.value = response.customers;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const newCustomer = await crm.customers.create(customerData);
      customers.value.push(newCustomer);
      return newCustomer;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  onMounted(() => {
    fetchCustomers();
  });

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer
  };
}

// components/CustomerList.vue
<template>
  <div>
    <div v-if="loading" class="text-white">Загрузка клиентов...</div>
    <div v-else-if="error" class="text-red-400">Ошибка: {{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="customer in customers" :key="customer.id"
           class="p-4 bg-gray-800 rounded-lg">
        <h3 class="text-white font-semibold">{{ customer.name }}</h3>
        <p class="text-gray-300 text-sm">{{ customer.email }}</p>
        <p class="text-gray-400 text-sm">{{ customer.company }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRundexCRM } from '@/composables/useRundexCRM';

const { customers, loading, error } = useRundexCRM();
</script>`}
                  </pre>
                </div>
              </div>

              {/* Node.js Example */}
              <div id="nodejs-example" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Node.js + Express
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`// server.js
const express = require('express');
const { RundexCRM } = require('@rundex/crm-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Инициализация SDK
const crm = new RundexCRM({
  apiKey: process.env.RUNDEX_API_KEY,
  environment: 'production'
});

// Эндпоинт для получения клиентов
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await crm.customers.list({
      limit: req.query.limit || 50,
      offset: req.query.offset || 0
    });

    res.json(customers);
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Эндпоинт для создания клиента
app.post('/api/customers', async (req, res) => {
  try {
    const customer = await crm.customers.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    res.status(400).json({ error: 'Ошибка валидации данных' });
  }
});

// Webhook обработчик
app.post('/webhooks/rundex', (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'customer.created':
      console.log('Новый клиент создан:', data);
      // Здесь можно отправить уведомление или обновить кэш
      break;
    case 'deal.won':
      console.log('Сделка выиграна:', data);
      // Автоматическое создание задачи или уведомление команды
      break;
  }

  res.json({ status: 'received' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
});`}
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div id="python-example" className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                  Python + FastAPI
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`# main.py
from fastapi import FastAPI, HTTPException
from rundex_sdk import RundexCRM
import os

app = FastAPI(title="My CRM Integration")

# Инициализация SDK
crm = RundexCRM(
    api_key=os.getenv("RUNDEX_API_KEY"),
    environment="production"
)

@app.get("/customers")
async def get_customers(limit: int = 50, offset: int = 0):
    """Получить список клиентов"""
    try:
        response = await crm.customers.list(limit=limit, offset=offset)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/customers")
async def create_customer(customer_data: dict):
    """Создать нового клиента"""
    try:
        customer = await crm.customers.create(customer_data)
        return customer
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/analytics/sales")
async def get_sales_analytics(start_date: str, end_date: str):
    """Получить аналитику продаж"""
    try:
        metrics = await crm.analytics.get_sales_metrics(
            start_date=start_date,
            end_date=end_date
        )
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Webhook обработчик
@app.post("/webhooks/rundex")
async def rundex_webhook(payload: dict):
    """Обработка webhook уведомлений от Rundex"""
    event = payload.get("event")
    data = payload.get("data")

    if event == "customer.created":
        print(f"Новый клиент создан: {data['name']}")
        # Здесь можно отправить уведомление в Slack/Telegram
    elif event == "deal.won":
        print(f"Сделка выиграна: {data['amount']} RUB")
        # Автоматическое создание задачи в трекере

    return {"status": "received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`}
                  </pre>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">Хотите больше примеров?</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Получите доступ к полной коллекции примеров кода и шаблонов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://github.com/MagistrTheOne/rundex-examples" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8">
                  Репозиторий с примерами
                </Button>
              </a>
              <Link href="/docs/api">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                  Документация API
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
