"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle, ChevronDown } from "lucide-react";
import type { Service } from "@/data/services";
import { services } from "@/data/services";
import type { PlaceDetails } from "@/lib/google-places";
import { contacts } from "@/data/contacts";
import Breadcrumbs from "./Breadcrumbs";
import ContactForm from "./ContactForm";
import Reviews from "./Reviews";
import ServiceIcon from "@/components/icons/ServiceIcons";
import AnimatedCounter from "./AnimatedCounter";

interface ServicePageContentProps {
  service: Service;
  reviews?: PlaceDetails | null;
}

/* ── Scroll reveal hook ── */
function useRevealObserver(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const reveals = el.querySelectorAll(".reveal");
    reveals.forEach((r) => observer.observe(r));
    return () => reveals.forEach((r) => observer.unobserve(r));
  }, [ref]);
}

/* ── FAQ Accordion Item ── */
function FAQAccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`reveal stagger-${Math.min(index + 1, 8)} card overflow-hidden`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer gap-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h3 className="font-heading text-base md:text-lg font-semibold text-[var(--color-foreground)] pr-4">
          {q}
        </h3>
        <ChevronDown
          size={18}
          className="text-[var(--color-accent)] shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s var(--ease-out)",
          }}
        />
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s var(--ease-out)",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-5 md:pb-6 text-[var(--color-foreground-secondary)] text-sm md:text-base leading-relaxed">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePageContent({ service, reviews }: ServicePageContentProps) {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const subServicesRef = useRef<HTMLElement>(null);
  const advantagesRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const otherRef = useRef<HTMLElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useRevealObserver(statsRef);
  useRevealObserver(subServicesRef);
  useRevealObserver(advantagesRef);
  useRevealObserver(stagesRef);
  useRevealObserver(faqRef);
  useRevealObserver(ctaRef);
  useRevealObserver(otherRef);

  const reveal = (delay: number) =>
    mounted
      ? "opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
      : "opacity-0 translate-y-6";
  const revealStyle = (delay: number) =>
    mounted ? { transitionDelay: `${delay}ms` } : {};

  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[60dvh] md:min-h-[70dvh] flex items-end overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={service.heroImage || "/images/hero-1.png"}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-deep)] via-black/75 to-black/50" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24 pt-28 sm:pt-36">
          <div className={`mb-4 ${reveal(0)}`} style={revealStyle(0)}>
            <Breadcrumbs items={[{ label: service.shortTitle }]} />
          </div>

          <h1
            className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[var(--color-foreground)] max-w-4xl ${reveal(120)}`}
            style={revealStyle(120)}
          >
            {service.title}
          </h1>

          <p
            className={`mt-6 text-lg md:text-xl text-[var(--color-foreground-secondary)] max-w-3xl leading-relaxed ${reveal(200)}`}
            style={revealStyle(200)}
          >
            {service.description}
          </p>

          {/* Hero CTA */}
          <div
            className={`mt-8 flex flex-wrap gap-4 ${reveal(280)}`}
            style={revealStyle(280)}
          >
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="inline-flex items-center gap-2.5 py-3.5 px-7 bg-[var(--color-accent)] hover:brightness-110 text-[var(--color-bg-deep)] font-semibold rounded-full active:scale-[0.97] min-h-[48px]"
              style={{ transition: "filter 200ms var(--ease-out), transform 150ms var(--ease-out)" }}
            >
              <Phone size={18} strokeWidth={2.5} />
              Безкоштовна консультація
            </a>
            <a
              href="#service-cta"
              className="inline-flex items-center gap-2 py-3.5 px-7 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-foreground)] font-semibold rounded-full active:scale-[0.97] min-h-[48px]"
              style={{ transition: "border-color 300ms var(--ease-out), transform 150ms var(--ease-out)" }}
            >
              Залишити заявку
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      {service.stats && service.stats.length > 0 && (
        <section ref={statsRef} className="py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(service.stats.length, 4)} gap-4 md:gap-6`}>
              {service.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`reveal stagger-${i + 1} card-accent p-5 md:p-7 text-center`}
                >
                  <div className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <p className="text-[var(--color-foreground-secondary)] text-sm md:text-base">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ LONG DESCRIPTION ═══════════ */}
      {service.longDescription && (
        <section className="pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="prose-custom text-[var(--color-foreground-secondary)] text-base md:text-lg leading-relaxed space-y-5">
              {service.longDescription.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ SUB-SERVICES ═══════════ */}
      <section ref={subServicesRef} className="section-glow py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <span className="reveal stagger-1 eyebrow inline-block mb-4">Напрямки</span>
            <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
              Що входить у <span className="gold-gradient">{service.shortTitle.toLowerCase()}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {service.subServices.map((sub, i) => (
              <div
                key={sub.title}
                className={`reveal stagger-${Math.min(i + 1, 8)} card p-6 md:p-8`}
              >
                <h3 className="font-heading text-lg md:text-xl font-semibold text-[var(--color-foreground)] mb-3">
                  {sub.title}
                </h3>
                <p className="text-[var(--color-foreground-secondary)] text-sm md:text-base leading-relaxed">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ADVANTAGES ═══════════ */}
      {service.advantages && service.advantages.length > 0 && (
        <section ref={advantagesRef} className="py-20 md:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — lawyer photo */}
              <div className="reveal stagger-1 relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/photo.jpg"
                  alt={contacts.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Right — advantages list */}
              <div>
                <span className="reveal stagger-1 eyebrow inline-block mb-4">Переваги</span>
                <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-8">
                  Чому обирають <span className="gold-gradient">мене</span>
                </h2>

                <div className="space-y-4">
                  {service.advantages.map((adv, i) => (
                    <div
                      key={i}
                      className={`reveal stagger-${Math.min(i + 3, 8)} flex items-start gap-3`}
                    >
                      <CheckCircle
                        size={20}
                        className="text-[var(--color-accent)] mt-0.5 shrink-0"
                      />
                      <p className="text-[var(--color-foreground-secondary)] text-base leading-relaxed">
                        {adv}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ WORK STAGES ═══════════ */}
      {service.workStages && service.workStages.length > 0 && (
        <section ref={stagesRef} className="section-glow py-20 md:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <span className="reveal stagger-1 eyebrow inline-block mb-4">Як це працює</span>
              <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
                Етапи <span className="gold-gradient">роботи</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.workStages.map((stage, i) => (
                <div
                  key={stage.title}
                  className={`reveal stagger-${Math.min(i + 1, 8)} card p-6 md:p-8 relative`}
                >
                  {/* Step number */}
                  <div className="font-heading text-5xl font-bold text-[var(--color-accent)]/10 absolute top-4 right-5 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="icon-container mb-5">
                    <span className="font-heading text-sm font-bold text-[var(--color-accent)]">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-[var(--color-foreground)] mb-3">
                    {stage.title}
                  </h3>
                  <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FAQ ═══════════ */}
      {service.faq.length > 0 && (
        <section ref={faqRef} className="py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <span className="reveal stagger-1 eyebrow inline-block mb-4">FAQ</span>
              <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
                Часті <span className="gold-gradient">питання</span>
              </h2>
            </div>

            <div className="space-y-3">
              {service.faq.map((item, i) => (
                <FAQAccordionItem key={i} q={item.question} a={item.answer} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ REVIEWS ═══════════ */}
      <Reviews data={reviews ?? null} />

      {/* ═══════════ OTHER SERVICES ═══════════ */}
      <section ref={otherRef} className="py-16 md:py-20 lg:py-24 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 md:mb-14">
            <span className="reveal stagger-1 eyebrow inline-block mb-4">Напрямки практики</span>
            <h2 className="reveal stagger-2 font-heading text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
              Інші <span className="gold-gradient">послуги</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {otherServices.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className={`reveal stagger-${Math.min(i + 1, 8)} card p-5 md:p-6 cursor-pointer group`}
              >
                <div className="icon-container mb-4 group-hover:scale-105"
                  style={{ transition: "transform 0.4s var(--ease-out)" }}
                >
                  <ServiceIcon slug={s.slug} size={20} />
                </div>
                <h3 className="font-heading text-base font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] mb-1.5"
                  style={{ transition: "color 0.3s var(--ease-out)" }}
                >
                  {s.shortTitle}
                </h3>
                <p className="text-[var(--color-muted)] text-xs leading-relaxed line-clamp-2">
                  {s.description.slice(0, 80)}...
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section id="service-cta" ref={ctaRef} className="section-glow py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 md:mb-14">
            <p className="reveal stagger-1 eyebrow mb-4">Зворотний зв&apos;язок</p>
            <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold mb-4">
              Потрібна <span className="gold-gradient">допомога</span>?
            </h2>
            <p className="reveal stagger-3 text-[var(--color-foreground-secondary)] text-lg max-w-xl mx-auto">
              Залиште заявку — проконсультую безкоштовно протягом години
            </p>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
