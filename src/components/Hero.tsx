"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { contacts } from "@/data/contacts";
import ContactForm from "./ContactForm";

const slideImages = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Auto-advance every 6s */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  /* Mount-based reveal helpers */
  const reveal = (delay: number) =>
    mounted
      ? `opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]`
      : `opacity-0 translate-y-6`;

  const revealStyle = (delay: number) =>
    mounted ? { transitionDelay: `${delay}ms` } : {};

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
    >
      {/* ── Background image slides with ken-burns ── */}
      {slideImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{
            opacity: currentSlide === i ? 1 : 0,
            transitionTimingFunction:
              "cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className={`object-cover transition-transform duration-[6000ms] ease-linear ${
              currentSlide === i ? "scale-110" : "scale-100"
            }`}
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Heavy dark overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-deep)] via-black/70 to-black/50" />

      {/* ── Decorative navy glow ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07] blur-[160px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e3a5f 0%, transparent 70%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24 sm:pb-28 lg:pb-20 pt-32 sm:pt-40 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* ── Left column ── */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7 sm:space-y-8">
            {/* Eyebrow */}
            <span
              className={`eyebrow inline-block ${reveal(0)}`}
              style={revealStyle(0)}
            >
              Адвокат у Чернівцях з 2003 року
            </span>

            {/* H1 — massive serif */}
            <h1
              className={`font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[var(--color-foreground)] ${reveal(120)}`}
              style={revealStyle(120)}
            >
              Захищу ваші права
              <br />
              <span className="gold-gradient">професійно</span> та{" "}
              <span className="gold-gradient">результативно</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-[var(--color-foreground-secondary)] max-w-xl leading-relaxed mx-auto lg:mx-0 ${reveal(240)}`}
              style={revealStyle(240)}
            >
              Юридичні проблеми не чекають — і я теж. Від першої консультації до
              рішення суду на вашому боці. Понад 23 роки успішної практики.
            </p>

            {/* Photo + name row */}
            <div
              className={`flex items-center justify-center lg:justify-start gap-4 ${reveal(360)}`}
              style={revealStyle(360)}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[var(--color-accent)]/40 shadow-[0_0_30px_rgba(201,168,76,0.15)] flex-shrink-0">
                <Image
                  src="/images/photo.jpg"
                  alt={contacts.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-left">
                <p className="text-[var(--color-foreground)] font-semibold text-base">
                  {contacts.name}
                </p>
                <p className="text-[var(--color-muted)] text-sm">
                  Адвокат &bull; з 2003 року
                </p>
              </div>
            </div>

            {/* Mobile CTA */}
            <div
              className={`lg:hidden ${reveal(480)}`}
              style={revealStyle(480)}
            >
              <a
                href={`tel:${contacts.phoneRaw}`}
                className="inline-flex w-full items-center justify-center gap-2.5 py-4 px-8 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-bg-deep)] font-semibold rounded-xl transition-all duration-300 ease-[var(--ease-out)] active:scale-[0.97] min-h-[52px] text-base"
              >
                <Phone size={18} strokeWidth={2.5} />
                Зателефонувати
              </a>
            </div>
          </div>

          {/* ── Right column — ContactForm (desktop only) ── */}
          <div
            className={`hidden lg:block lg:col-span-5 ${reveal(400)}`}
            style={revealStyle(400)}
          >
            <div className="card-premium">
              <div className="card-premium-inner">
                <ContactForm variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pill dot indicators ── */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slideImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-500 ease-[var(--ease-out)] cursor-pointer ${
              currentSlide === i
                ? "w-8 bg-[var(--color-accent)]"
                : "w-4 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
