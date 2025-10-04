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
      <SheetContent className="bg-black/95 backdrop-blur-lg border-white/10 text-white">
        <div className="flex flex-col space-y-6 mt-8">
          <Link
            href="/"
            className="text-white hover:text-blue-400 transition-colors text-lg py-2"
            onClick={() => setOpen(false)}
          >
            Главная
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition-colors text-lg py-2"
            onClick={() => setOpen(false)}
          >
            О нас
          </Link>
          <Link
            href="/pricing"
            className="text-gray-300 hover:text-white transition-colors text-lg py-2"
            onClick={() => setOpen(false)}
          >
            Цены
          </Link>
          <Link
            href="/premium"
            className="text-gray-300 hover:text-white transition-colors text-lg py-2"
            onClick={() => setOpen(false)}
          >
            Премиум
          </Link>
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
              onClick={() => setOpen(false)}
            >
              Войти
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
