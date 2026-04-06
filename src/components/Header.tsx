"use client";

import { useState } from "react";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { contacts } from "@/data/contacts";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col">
            <span className="text-lg md:text-xl font-bold gold-gradient">
              Адвокат Левченко
            </span>
            <span className="text-xs text-slate-400 hidden sm:block">
              Наталія Вікторівна
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              {contacts.phone}
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-3 text-base text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="block px-3 py-3 text-base text-amber-400 font-medium"
            >
              {contacts.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
