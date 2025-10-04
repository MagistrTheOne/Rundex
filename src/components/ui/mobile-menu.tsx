"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl border-white/10 text-white w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-3 pb-8 mb-8 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Rundex</h3>
              <p className="text-gray-400 text-sm">Enterprise CRM</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 text-white hover:bg-white/10 transition-colors text-lg py-3 px-4 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Главная</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-lg py-3 px-4 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>О компании</span>
            </Link>

            <Link
              href="/pricing"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-lg py-3 px-4 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Тарифы</span>
            </Link>

            <Link
              href="/premium"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-lg py-3 px-4 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Premium</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-lg py-3 px-4 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Дашборд</span>
            </Link>

            {/* Documentation Section */}
            <div className="pt-4 pb-2">
              <h4 className="text-white font-semibold text-sm mb-3 px-4">Документация</h4>
              <div className="space-y-1">
                <Link
                  href="/docs"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm py-2 px-4 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Документация</span>
                </Link>
                <Link
                  href="/docs/api"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm py-2 px-4 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>API</span>
                </Link>
                <Link
                  href="/status"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm py-2 px-4 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Статус</span>
                </Link>
              </div>
            </div>

            {/* Support Section */}
            <div className="pt-2 pb-4">
              <h4 className="text-white font-semibold text-sm mb-3 px-4">Поддержка</h4>
              <div className="space-y-1">
                <Link
                  href="/help"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm py-2 px-4 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Помощь</span>
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm py-2 px-4 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Контакты</span>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-6 border-t border-white/10 mt-auto">
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold"
                onClick={() => setOpen(false)}
              >
                🚀 Начать бесплатно
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Войти в аккаунт
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 mt-6">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.162 1.219-5.162s-.279-.558-.279-1.379c0-1.279.74-2.237 1.658-2.237.783 0 1.16.588 1.16 1.299 0 .787-.501 1.968-.759 3.063-.219.919.461 1.668 1.36 1.668 1.639 0 2.898-1.719 2.898-4.201 0-2.198-1.579-3.736-3.837-3.736-2.617 0-4.15 1.96-4.15 3.988 0 .787.301 1.631.679 2.088.078.099.099.179.079.279-.08.301-.24 1.04-.28 1.178-.04.179-.139.219-.321.139-1.199-.559-1.939-2.298-1.939-3.697 0-2.897 2.099-5.556 6.077-5.556 3.198 0 5.675 2.278 5.675 5.321 0 3.177-2.001 5.734-4.777 5.734-.939 0-1.818-.499-2.118-1.099 0 0-.479 1.838-.599 2.277-.219.859-.8 1.919-1.199 2.577C9.197 23.814 10.566 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
