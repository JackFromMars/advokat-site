"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { navigation } from "@/data/navigation";
import { contacts } from "@/data/contacts";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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
        className="fixed top-0 left-0 right-0 z-50 hidden md:block pointer-events-none"
      >
        <div className="max-w-4xl mx-auto mt-4 pointer-events-auto">
          <nav
            className="rounded-full border border-[var(--color-border)] px-6 py-3 flex items-center justify-between"
            style={{
              background: scrolled
                ? "rgba(10, 13, 21, 0.85)"
                : "rgba(10, 13, 21, 0.55)",
              backdropFilter: "blur(20px) saturate(1.4)",
              WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              transition: "background 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out)",
              boxShadow: scrolled
                ? "0 8px 32px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.06)"
                : "0 4px 24px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Logo */}
            <Link href="/" className="cursor-pointer shrink-0">
              <Image
                src="/images/logo.svg"
                alt="Адвокат Левченко"
                width={140}
                height={44}
                className="h-9 w-auto"
                priority
              />
            </Link>

            {/* Center nav links */}
            <div className="flex items-center gap-1">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-[13px] uppercase tracking-[0.08em] font-medium text-[var(--color-foreground-secondary)] rounded-full cursor-pointer"
                  style={{
                    transition: "color 0.3s var(--ease-out), background-color 0.3s var(--ease-out)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-foreground-secondary)";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Phone */}
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-[var(--color-accent)] cursor-pointer shrink-0"
              style={{
                transition: "opacity 0.3s var(--ease-out), transform 0.15s var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Phone size={14} strokeWidth={2.5} />
              {contacts.phone}
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Mobile header ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: scrolled || isOpen
            ? "rgba(10, 13, 21, 0.9)"
            : "rgba(10, 13, 21, 0.6)",
          backdropFilter: "blur(16px) saturate(1.3)",
          WebkitBackdropFilter: "blur(16px) saturate(1.3)",
          transition: "background 0.4s var(--ease-out)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-16">
          {/* Logo */}
          <Link href="/" className="cursor-pointer" onClick={closeMenu}>
            <Image
              src="/images/logo.svg"
              alt="Адвокат Левченко"
              width={130}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Hamburger / X morph button */}
          <button
            type="button"
            className="relative w-11 h-11 flex items-center justify-center cursor-pointer rounded-lg"
            style={{
              transition: "background-color 0.3s var(--ease-out)",
            }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={isOpen}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-glass)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Three bars that morph into X */}
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
        className="fixed inset-0 z-40 md:hidden flex flex-col"
        style={{
          background: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s var(--ease-drawer)",
        }}
      >
        {/* Spacer for header height */}
        <div className="h-16 shrink-0" />

        {/* Nav links with staggered reveal */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {navigation.main.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-4 min-h-[44px] text-2xl font-medium text-[var(--color-foreground)] cursor-pointer"
              style={{
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? 1 : 0,
                transition: `transform 0.5s var(--ease-drawer) ${isOpen ? index * 60 : 0}ms, opacity 0.4s var(--ease-drawer) ${isOpen ? index * 60 : 0}ms`,
              }}
              onClick={closeMenu}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-foreground)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Phone at bottom */}
        <div
          className="px-8 pb-10"
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(20px)",
            opacity: isOpen ? 1 : 0,
            transition: `transform 0.5s var(--ease-drawer) ${isOpen ? navigation.main.length * 60 + 40 : 0}ms, opacity 0.4s var(--ease-drawer) ${isOpen ? navigation.main.length * 60 + 40 : 0}ms`,
          }}
        >
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="inline-flex items-center gap-3 text-lg font-semibold text-[var(--color-accent)] cursor-pointer min-h-[44px]"
            style={{
              transition: "opacity 0.3s var(--ease-out), transform 0.15s var(--ease-out)",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
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
