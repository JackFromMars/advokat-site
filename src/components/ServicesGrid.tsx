"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { primaryServices, secondaryServices } from "@/data/services";
import ServiceIcon from "@/components/icons/ServiceIcons";
import HighlightCard from "@/components/HighlightCard";

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
      className="section-glow py-20 md:py-28 lg:py-32 relative overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.04]">
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

        {/* Primary services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
          {primaryServices.map((service, index) => (
            <HighlightCard key={service.slug}>
              <div className={`reveal stagger-${index + 1}`}>
                <Link
                  href={`/${service.slug}`}
                  className="group cursor-pointer block"
                >
                  <div
                    className="card-premium transition-all duration-500"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <div className="card-premium-inner p-6 md:p-8">
                      <div className="icon-container-lg mb-5">
                        <ServiceIcon slug={service.slug} size={24} />
                      </div>

                      <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-foreground)] mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {service.title}
                      </h3>

                      <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 mb-5">
                        {service.subServices.slice(0, 3).map((sub) => (
                          <li
                            key={sub.title}
                            className="text-xs text-[var(--color-muted)] flex items-start gap-2"
                          >
                            <span
                              className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: "var(--color-accent)",
                              }}
                            />
                            {sub.title}
                          </li>
                        ))}
                      </ul>

                      <div className="text-[var(--color-accent)] text-sm font-medium flex items-center gap-1.5 min-h-[44px]">
                        <span>Детальніше</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1.5 transition-transform duration-300"
                          style={{
                            transitionTimingFunction:
                              "cubic-bezier(0.23, 1, 0.32, 1)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </HighlightCard>
          ))}
        </div>

        {/* Secondary services heading */}
        <div className="text-center mb-8 md:mb-10">
          <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-foreground)]">
            Також допоможу з
          </h3>
        </div>

        {/* Secondary services */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {secondaryServices.map((service, index) => (
            <HighlightCard key={service.slug}>
              <div className={`reveal stagger-${index + 1}`}>
                <Link
                  href={`/${service.slug}`}
                  className="group cursor-pointer block"
                >
                  <div
                    className="glass glass-hover p-3 md:p-4 text-center min-h-[44px] transition-all duration-500"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <div className="icon-container mb-2 mx-auto">
                      <ServiceIcon slug={service.slug} size={20} />
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {service.shortTitle}
                    </h4>
                  </div>
                </Link>
              </div>
            </HighlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
