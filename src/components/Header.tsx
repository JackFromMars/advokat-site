"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { navigation } from "@/data/navigation";
import { contacts } from "@/data/contacts";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/icons/MessengerIcons";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ─── Desktop floating pill nav ─── */}
      <header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:block max-w-4xl w-[90%]"
        style={{
          transition: "box-shadow 0.5s var(--ease-out), background-color 0.5s var(--ease-out)",
        }}
      >
        <nav
          className="rounded-full border border-[var(--color-border)] px-6 py-3 flex items-center justify-between backdrop-blur-xl"
          style={{
            backgroundColor: scrolled
              ? "rgba(28, 32, 48, 0.92)"
              : "rgba(28, 32, 48, 0.80)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.06)"
              : "0 4px 24px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.06)",
            transition: "background-color 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="cursor-pointer shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Адвокат Левченко"
              width={140}
              height={40}
              className="h-8 md:h-9 w-auto"
              preload
            />
          </Link>

          {/* Center nav links */}
          <div className="flex items-center gap-1">
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[13px] uppercase tracking-[0.08em] font-medium text-[var(--color-foreground-secondary)] rounded-full cursor-pointer hover:text-[var(--color-accent)]"
                style={{
                  transition: "color 0.3s var(--ease-out), background-color 0.3s var(--ease-out)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Phone */}
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-[var(--color-accent)] cursor-pointer shrink-0 hover:opacity-80 active:scale-[0.97]"
            style={{
              transition: "opacity 0.3s var(--ease-out), transform 0.15s var(--ease-out)",
            }}
          >
            <Phone size={14} strokeWidth={2.5} />
            {contacts.phone}
          </a>
        </nav>
      </header>

      {/* ─── Mobile floating pill header ─── */}
      <header
        className="fixed top-3 left-3 right-3 z-40 md:hidden rounded-full border border-[var(--color-border)] backdrop-blur-xl"
        style={{
          backgroundColor: scrolled || isOpen
            ? "rgba(28, 32, 48, 0.92)"
            : "rgba(28, 32, 48, 0.80)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 4px 16px rgba(0,0,0,0.2)",
          transition: "background-color 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-14">
          {/* Logo */}
          <Link href="/" className="cursor-pointer" onClick={closeMenu}>
            <Image
              src="/images/logo.svg"
              alt="Адвокат Левченко"
              width={140}
              height={40}
              className="h-8 w-auto"
              preload
            />
          </Link>

          {/* Hamburger / X morph button */}
          <button
            type="button"
            className="relative w-11 h-11 flex items-center justify-center cursor-pointer rounded-full hover:bg-white/5 active:scale-[0.97]"
            style={{
              transition: "background-color 0.3s var(--ease-out), transform 0.15s var(--ease-out)",
            }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-3.5">
              {/* Top bar */}
              <span
                className="absolute left-0 w-full h-[1.5px] bg-[var(--color-foreground)] rounded-full"
                style={{
                  top: isOpen ? "50%" : "0",
                  transform: isOpen ? "translateY(-50%) rotate(45deg)" : "translateY(0) rotate(0)",
                  transition: "top 0.3s var(--ease-out), transform 0.3s var(--ease-out)",
                }}
              />
              {/* Middle bar */}
              <span
                className="absolute left-0 top-1/2 w-full h-[1.5px] bg-[var(--color-foreground)] rounded-full"
                style={{
                  opacity: isOpen ? 0 : 1,
                  transform: `translateY(-50%) scaleX(${isOpen ? 0 : 1})`,
                  transition: "opacity 0.2s var(--ease-out), transform 0.2s var(--ease-out)",
                }}
              />
              {/* Bottom bar */}
              <span
                className="absolute left-0 w-full h-[1.5px] bg-[var(--color-foreground)] rounded-full"
                style={{
                  bottom: isOpen ? "auto" : "0",
                  top: isOpen ? "50%" : "auto",
                  transform: isOpen ? "translateY(-50%) rotate(-45deg)" : "translateY(0) rotate(0)",
                  transition: "top 0.3s var(--ease-out), bottom 0.3s var(--ease-out), transform 0.3s var(--ease-out)",
                }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* ─── Mobile menu overlay ─── */}
      <div
        className="fixed inset-0 z-30 md:hidden flex flex-col"
        style={{
          background: "var(--color-bg-deep, #0A0D15)",
          opacity: isOpen ? 0.95 : 0,
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s var(--ease-out)",
        }}
      >
        {/* Spacer for pill header */}
        <div className="h-20 shrink-0" />

        {/* Nav links with staggered reveal */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {navigation.main.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-4 min-h-[44px] text-2xl font-medium text-[var(--color-foreground)] cursor-pointer hover:text-[var(--color-accent)]"
              style={{
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? 1 : 0,
                transition: `transform 0.5s var(--ease-out) ${isOpen ? index * 80 : 0}ms, opacity 0.4s var(--ease-out) ${isOpen ? index * 80 : 0}ms`,
              }}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Messenger icons + Phone at bottom */}
        <div
          className="px-8 pb-10"
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(20px)",
            opacity: isOpen ? 1 : 0,
            transition: `transform 0.5s var(--ease-out) ${isOpen ? navigation.main.length * 80 + 40 : 0}ms, opacity 0.4s var(--ease-out) ${isOpen ? navigation.main.length * 80 + 40 : 0}ms`,
          }}
        >
          {/* Messenger icons */}
          <div className="flex items-center justify-center gap-5 pt-4 mb-5">
            <a href={contacts.messengers.telegram} target="_blank" rel="noopener noreferrer"
               className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
               aria-label="Telegram">
              <TelegramIcon size={22} />
            </a>
            <a href={contacts.messengers.viber} target="_blank" rel="noopener noreferrer"
               className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
               aria-label="Viber">
              <ViberIcon size={22} />
            </a>
            <a href={contacts.messengers.whatsapp} target="_blank" rel="noopener noreferrer"
               className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
               aria-label="WhatsApp">
              <WhatsAppIcon size={22} />
            </a>
          </div>
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--color-accent)] cursor-pointer min-h-[44px] active:scale-[0.97]"
            style={{
              transition: "opacity 0.3s var(--ease-out), transform 0.15s var(--ease-out)",
            }}
          >
            <Phone size={18} strokeWidth={2.5} />
            {contacts.phone}
          </a>
        </div>
      </div>
    </>
  );
}
