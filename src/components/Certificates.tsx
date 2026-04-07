"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Award, GraduationCap, Shield, Globe, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Certificate {
  title: string;
  org: string;
  year: string;
  icon: typeof Award;
  image?: string; // jpg/png for lightbox
  pdf?: string; // pdf fallback
  featured?: boolean;
}

const certificates: Certificate[] = [
  {
    title: "Свідоцтво про право на заняття адвокатською діяльністю",
    org: "Національна асоціація адвокатів України",
    year: "Серія ЧЦ №000611",
    icon: Award,
    image: "/images/certs/svidotstvo.jpg",
    featured: true,
  },
  {
    title: "Підвищення професійного рівня за 2025 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2026",
    icon: GraduationCap,
    pdf: "/images/certs/cert-hsa-2025.pdf",
  },
  {
    title: "Підвищення професійного рівня за 2024 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2024",
    icon: GraduationCap,
    pdf: "/images/certs/cert-hsa-2024.pdf",
  },
  {
    title: "Підвищення професійного рівня за 2023 рік",
    org: "Вища школа адвокатури (HSA)",
    year: "2024",
    icon: GraduationCap,
    pdf: "/images/certs/cert-hsa-2023.pdf",
  },
  {
    title: "Захист персональних даних — спеціалізований курс",
    org: "Рада Європи / EdEra",
    year: "2024",
    icon: Shield,
    pdf: "/images/certs/cert-personal-data-spec.pdf",
  },
  {
    title: "Захист персональних даних",
    org: "Рада Європи / EdEra",
    year: "2024",
    icon: Shield,
    pdf: "/images/certs/cert-personal-data.pdf",
  },
  {
    title: "BSAFE — безпека персоналу ООН",
    org: "UNDSS (United Nations)",
    year: "2023",
    icon: Globe,
    pdf: "/images/certs/cert-undss-bsafe.pdf",
  },
  {
    title: "Prevention of Sexual Exploitation and Abuse",
    org: "UNHCR",
    year: "2023",
    icon: Globe,
    pdf: "/images/certs/cert-psea-unhcr.pdf",
  },
];

export default function Certificates() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nextCert = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % certificates.length);
  }, []);

  const prevCert = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + certificates.length) % certificates.length
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextCert();
      if (e.key === "ArrowLeft") prevCert();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, nextCert, prevCert]);

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

  const featured = certificates[0];
  const others = certificates.slice(1);

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Featured — Свідоцтво */}
            <div
              className="reveal stagger-1 lg:col-span-5 cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <div className="card overflow-hidden h-full">
                {featured.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.03]"
                      style={{
                        transition:
                          "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                      }}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award
                      size={16}
                      className="text-[var(--color-accent)]"
                    />
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]/70">
                      {featured.year}
                    </span>
                  </div>
                  <h3 className="font-heading text-base md:text-lg font-semibold text-[var(--color-foreground)] mb-1">
                    {featured.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm">
                    {featured.org}
                  </p>
                </div>
              </div>
            </div>

            {/* Other certificates grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((cert, i) => {
                const Icon = cert.icon;
                const globalIndex = i + 1;
                return (
                  <div
                    key={cert.title}
                    className={`reveal stagger-${Math.min(i + 2, 8)} card p-5 cursor-pointer group`}
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="icon-container shrink-0 group-hover:scale-105"
                        style={{
                          transition:
                            "transform 0.4s var(--ease-out)",
                        }}
                      >
                        <Icon
                          size={16}
                          className="text-[var(--color-accent)]"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] mb-1 line-clamp-2"
                          style={{ transition: "color 0.3s var(--ease-out)" }}
                        >
                          {cert.title}
                        </h3>
                        <p className="text-[var(--color-muted)] text-xs">
                          {cert.org}
                        </p>
                        <p className="text-[var(--color-accent)]/60 text-xs mt-1">
                          {cert.year}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            style={{
              animation: "fadeIn 200ms ease-out forwards",
            }}
          />

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
            aria-label="Закрити"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Nav arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevCert();
            }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
            aria-label="Попередній"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextCert();
            }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
            style={{ transition: "background-color 0.3s var(--ease-out)" }}
            aria-label="Наступний"
          >
            <ChevronRight size={20} className="text-white" />
          </button>

          {/* Content */}
          <div
            className="relative z-10 w-[90vw] max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {certificates[activeIndex].image ? (
              <div className="relative w-full max-h-[70vh] flex items-center justify-center">
                <Image
                  src={certificates[activeIndex].image!}
                  alt={certificates[activeIndex].title}
                  width={800}
                  height={600}
                  className="object-contain max-h-[70vh] rounded-lg"
                  style={{
                    animation:
                      "fadeInScale 300ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
                  }}
                />
              </div>
            ) : certificates[activeIndex].pdf ? (
              <iframe
                src={certificates[activeIndex].pdf}
                className="w-full h-[75vh] rounded-lg bg-white"
                style={{
                  animation:
                    "fadeInScale 300ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
                }}
                title={certificates[activeIndex].title}
              />
            ) : null}

            {/* Caption */}
            <div className="mt-4 text-center px-4">
              <p className="text-white font-heading font-semibold text-base">
                {certificates[activeIndex].title}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {certificates[activeIndex].org} &bull;{" "}
                {certificates[activeIndex].year}
              </p>
              <p className="text-white/40 text-xs mt-2">
                {activeIndex + 1} / {certificates.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
