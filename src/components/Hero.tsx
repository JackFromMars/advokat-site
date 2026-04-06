"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { contacts } from "@/data/contacts";
import ContactForm from "./ContactForm";

const slideImages = ["/images/hero-1.png", "/images/hero-2.png", "/images/hero-3.png"];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background slides */}
      {slideImages.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: currentSlide === i ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[var(--color-primary)] rounded-full opacity-[0.04] blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-amber-400 font-medium mb-4 text-sm uppercase tracking-wider">
              Адвокат у Чернівцях з 2003 року
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              Захищу ваші права{" "}
              <span className="gold-gradient">професійно</span> та{" "}
              <span className="gold-gradient">результативно</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Юридичні проблеми не чекають — і я теж. Від першої консультації до
              рішення суду на вашому боці. Понад 23 роки успішної практики.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-[0_0_30px_rgba(212,168,67,0.1)]">
                <Image
                  src="/images/photo.jpg"
                  alt={contacts.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{contacts.name}</p>
                <p className="text-slate-400 text-sm">Адвокат &bull; з 2003 року</p>
              </div>
            </div>

            <a
              href={`tel:${contacts.phoneRaw}`}
              className="lg:hidden cursor-pointer inline-flex items-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors duration-200 min-h-[44px]"
            >
              <Phone size={18} />
              Зателефонувати
            </a>
          </div>

          <div className="hidden lg:block">
            <ContactForm variant="hero" />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slideImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer before:block before:rounded-full before:transition-all before:duration-300 ${
              currentSlide === i
                ? "before:bg-[var(--color-accent)] before:w-6 before:h-2.5"
                : "before:bg-white/30 before:w-2.5 before:h-2.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
