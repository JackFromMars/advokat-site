"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { primaryServices, secondaryServices } from "@/data/services";
import ServiceIcon from "@/components/icons/ServiceIcons";

const imageMap: Record<string, string> = {
  "simejni-spravy": "/images/service-family.png",
  "zhytlovi-superechky": "/images/service-housing.png",
  "mobilizatsiya": "/images/service-military.png",
};

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-glow py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.03]">
        <Image
          src="/images/services-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow mb-4">Спеціалізація</div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)]">
            Основні <span className="gold-gradient">послуги</span>
          </h2>
          <p className="text-[var(--color-foreground-secondary)] max-w-2xl mx-auto mt-4">
            Спеціалізуюся на найбільш затребуваних напрямках юридичної практики
          </p>
        </div>

        {/* Primary services — photo cards, equal height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
          {primaryServices.map((service, index) => (
            <div key={service.slug} className={`reveal stagger-${index + 1} flex`}>
              <Link
                href={`/${service.slug}`}
                className="card-image group cursor-pointer flex flex-col"
              >
                {/* Photo area */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={imageMap[service.slug]}
                    alt={service.shortTitle}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                </div>

                {/* Content below photo */}
                <div className="p-5 md:p-7 flex flex-col flex-1">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-foreground)] mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {service.shortTitle}
                  </h3>

                  <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed mb-4 flex-1">
                    {service.description
                      .replace(/\.?\s*Досвід понад 23 роки[^.]*\./gi, ".")
                      .replace(/\.?\s*Адвокат Левченко[^.]*\./gi, ".")
                      .replace(/\.\s*\./g, ".")
                      .trim()}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {service.subServices.slice(0, 3).map((sub) => (
                      <li
                        key={sub.title}
                        className="text-xs text-[var(--color-muted)] flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                        {sub.title}
                      </li>
                    ))}
                  </ul>

                  <span className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-medium group-hover:gap-3 transition-all duration-300 mt-auto">
                    Детальніше <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Secondary services heading */}
        <div className="text-center mb-8 md:mb-10">
          <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-foreground)]">
            Також допоможу з
          </h3>
        </div>

        {/* Secondary services */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {secondaryServices.map((service, index) => (
            <div key={service.slug} className={`reveal stagger-${(index % 5) + 1}`}>
              <Link
                href={`/${service.slug}`}
                className="card p-4 md:p-5 group cursor-pointer block"
              >
                {/* Desktop: icon centered, no subtitle */}
                <div className="hidden md:flex flex-col items-center text-center gap-2">
                  <div className="icon-container">
                    <ServiceIcon slug={service.slug} size={20} />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {service.shortTitle}
                  </h4>
                </div>

                {/* Mobile: horizontal with subtitle */}
                <div className="flex md:hidden items-center gap-4">
                  <div className="icon-container shrink-0">
                    <ServiceIcon slug={service.slug} size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {service.shortTitle}
                    </h4>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">
                      {service.description.slice(0, 70)}...
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
