"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { navigation } from "@/data/navigation";
import { contacts } from "@/data/contacts";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col cursor-pointer">
            <span className="font-heading text-lg md:text-xl font-bold gold-gradient">
              Адвокат Левченко
            </span>
            <span className="text-xs text-[var(--color-muted)] hidden sm:block">
              Наталія Вікторівна
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors duration-200 rounded-lg hover:bg-[var(--color-glass)] cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:text-amber-300 transition-colors duration-150 font-medium cursor-pointer"
            >
              <Phone size={14} />
              {contacts.phone}
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors duration-150 cursor-pointer rounded-lg hover:bg-[var(--color-glass)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-[var(--color-border)]">
          <div className="px-4 py-3 space-y-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-3 min-h-[44px] flex items-center text-base text-[var(--color-muted)] hover:text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-glass)] transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="flex items-center gap-2 px-3 py-3 min-h-[44px] text-base text-[var(--color-accent)] font-medium cursor-pointer"
            >
              <Phone size={16} />
              {contacts.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
