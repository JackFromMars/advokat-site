"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Certificate {
  title: string;
  org: string;
  year: string;
  image: string;
}

const certificates: Certificate[] = [
  {
    title: "Підвищення професійного рівня за 2025 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2026",
    image: "/images/certs/cert-hsa-2025.jpg",
  },
  {
    title: "Захист персональних даних — спеціалізований курс",
    org: "Рада Європи / EdEra",
    year: "2024",
    image: "/images/certs/cert-personal-data-spec.jpg",
  },
  {
    title: "Підвищення професійного рівня за 2024 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2024",
    image: "/images/certs/cert-hsa-2024.jpg",
  },
  {
    title: "Захист персональних даних",
    org: "Рада Європи / EdEra",
    year: "2024",
    image: "/images/certs/cert-personal-data.jpg",
  },
  {
    title: "Свідоцтво про право на заняття адвокатською діяльністю",
    org: "Національна асоціація адвокатів України",
    year: "Серія ЧЦ №000611",
    image: "/images/certs/svidotstvo.jpg",
  },
  {
    title: "Підвищення професійного рівня за 2023 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2024",
    image: "/images/certs/cert-hsa-2023.jpg",
  },
  {
    title: "BSAFE — безпека персоналу ООН",
    org: "UNDSS (United Nations)",
    year: "2023",
    image: "/images/certs/cert-undss-bsafe.jpg",
  },
  {
    title: "Prevention of Sexual Exploitation and Abuse",
    org: "UNHCR",
    year: "2023",
    image: "/images/certs/cert-psea-unhcr.jpg",
  },
  {
    title: "Protection from Sexual Exploitation and Abuse (PSEA)",
    org: "CF «SSS»",
    year: "2023",
    image: "/images/certs/cert-psea-sss.jpg",
  },
];

export default function Certificates() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const didSwipe = useRef(false);

  // Auto-advance
  useEffect(() => {
    if (isPaused || lightboxOpen) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % certificates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, lightboxOpen]);

  const goTo = useCallback((i: number) => setCurrent(i), []);

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const lbNext = useCallback(() => {
    setLightboxIndex((p) => (p + 1) % certificates.length);
  }, []);

  const lbPrev = useCallback(() => {
    setLightboxIndex((p) => (p - 1 + certificates.length) % certificates.length);
  }, []);

  // Keyboard for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, lbNext, lbPrev]);

  // Scroll reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const reveals = section.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  const cert = certificates[current];

  return (
    <>
      <section ref={sectionRef} className="py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="reveal stagger-1 eyebrow inline-block mb-4">
              Кваліфікація
            </span>
            <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
              Ліцензії та{" "}
              <span className="gold-gradient">сертифікати</span>
            </h2>
          </div>

          <div
            className="reveal stagger-3 max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* ── Main slide ── */}
            <div
              className="card overflow-hidden cursor-pointer group"
              onClick={() => {
                if (!didSwipe.current) openLightbox(current);
                didSwipe.current = false;
              }}
              onTouchStart={(e) => {
                touchStart.current = e.touches[0].clientX;
                touchStartTime.current = Date.now();
                didSwipe.current = false;
              }}
              onTouchEnd={(e) => {
                if (touchStart.current === null) return;
                const diff = touchStart.current - e.changedTouches[0].clientX;
                const elapsed = Date.now() - touchStartTime.current;
                touchStart.current = null;
                if (Math.abs(diff) > 40 && elapsed < 500) {
                  didSwipe.current = true;
                  if (diff > 0) {
                    setCurrent((p) => (p + 1) % certificates.length);
                  } else {
                    setCurrent((p) => (p - 1 + certificates.length) % certificates.length);
                  }
                }
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-[var(--color-bg-base)]">
                {certificates.map((c, i) => (
                  <div
                    key={c.image}
                    className="absolute inset-0"
                    style={{
                      opacity: current === i ? 1 : 0,
                      transition: "opacity 0.5s var(--ease-out)",
                    }}
                  >
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-contain group-hover:scale-[1.02]"
                      style={{
                        transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                      }}
                      sizes="(max-width: 768px) 100vw, 700px"
                      priority={i === 0}
                    />
                  </div>
                ))}

                {/* Nav arrows on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent((p) => (p - 1 + certificates.length) % certificates.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-black/60"
                  style={{ transition: "opacity 0.3s var(--ease-out), background-color 0.3s var(--ease-out)" }}
                  aria-label="Попередній"
                >
                  <ChevronLeft size={18} className="text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent((p) => (p + 1) % certificates.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-black/60"
                  style={{ transition: "opacity 0.3s var(--ease-out), background-color 0.3s var(--ease-out)" }}
                  aria-label="Наступний"
                >
                  <ChevronRight size={18} className="text-white" />
                </button>
              </div>

              {/* Caption */}
              <div className="p-4 md:p-5">
                <h3 className="font-heading text-base md:text-lg font-semibold text-[var(--color-foreground)] mb-1">
                  {cert.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  {cert.org} &bull; {cert.year}
                </p>
              </div>
            </div>

            {/* ── Thumbnails ── */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {certificates.map((c, i) => (
                <button
                  key={c.image}
                  onClick={() => goTo(i)}
                  className="shrink-0 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    width: 72,
                    height: 50,
                    border: current === i
                      ? "2px solid var(--color-accent)"
                      : "2px solid transparent",
                    opacity: current === i ? 1 : 0.5,
                    transition: "border-color 0.3s var(--ease-out), opacity 0.3s var(--ease-out)",
                  }}
                  aria-label={c.title}
                >
                  <Image
                    src={c.image}
                    alt=""
                    width={72}
                    height={50}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Counter */}
            <p className="text-center text-[var(--color-muted)] text-xs mt-3">
              {current + 1} / {certificates.length}
            </p>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
            aria-label="Закрити"
          >
            <X size={20} className="text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); lbPrev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); lbNext(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
          >
            <ChevronRight size={20} className="text-white" />
          </button>

          <div
            className="relative z-10 w-[92vw] max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full flex items-center justify-center" style={{ maxHeight: "72vh" }}>
              <Image
                src={certificates[lightboxIndex].image}
                alt={certificates[lightboxIndex].title}
                width={1200}
                height={850}
                className="object-contain max-h-[72vh] rounded-lg"
                style={{
                  animation: "fadeInScale 250ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
                }}
              />
            </div>

            <div className="mt-4 text-center px-4">
              <p className="text-white font-heading font-semibold text-base">
                {certificates[lightboxIndex].title}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {certificates[lightboxIndex].org} &bull; {certificates[lightboxIndex].year}
              </p>
              <p className="text-white/40 text-xs mt-2">
                {lightboxIndex + 1} / {certificates.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
