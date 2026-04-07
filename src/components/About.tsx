"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { contacts } from "@/data/contacts";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const principles = [
    "Професіоналізм та відповідальність",
    "Домінування інтересів клієнта",
    "Робота до одержання обумовленого результату",
    "Гарантії якості, своєчасності та конфіденційності",
    "Індивідуальний підхід до кожної справи",
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    const reveals = section.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-glow py-20 md:py-28 lg:py-32 relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.05]">
        <Image
          src="/images/about-bg.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          {/* Photo column */}
          <div className="lg:col-span-2 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="reveal stagger-1 max-w-xs w-full">
              <div className="card shadow-[0_0_60px_rgba(201,168,76,0.1)]">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src="/images/photo.jpg"
                    alt={contacts.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 320px, 400px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-3 order-1 lg:order-2 text-center lg:text-left">
            <div className="reveal stagger-2">
              <span className="eyebrow">Про адвоката</span>
            </div>

            <h2 className="reveal stagger-3 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mt-4 mb-6">
              Досвід, якому{" "}
              <span className="gold-gradient">довіряють</span>
            </h2>

            <p className="reveal stagger-4 text-xl text-[var(--color-accent)] font-heading mb-6">
              {contacts.name}
            </p>

            <p className="reveal stagger-4 text-[var(--color-foreground-secondary)] leading-relaxed mb-5 max-w-2xl mx-auto lg:mx-0">
              Успішна юридична практика із 2003 року. Спеціалізуюся у сфері
              цивільного, господарського, кримінального права, а також
              юридичного обслуговування бізнесу та фізичних осіб.
            </p>

            <p className="reveal stagger-5 text-[var(--color-foreground-secondary)] leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              У кожній судовій справі та юридичній консультації прагну знайти
              найефективніший шлях до захисту інтересів клієнта. Використовую
              тільки законні та перевірені методи.
            </p>

            <h3 className="reveal stagger-6 font-heading text-lg font-semibold text-[var(--color-foreground)] mb-5">
              Принципи роботи:
            </h3>

            <ul className="space-y-3">
              {principles.map((principle, i) => (
                <li
                  key={principle}
                  className={`reveal stagger-${Math.min(i + 7, 8)} flex items-start gap-3 text-[var(--color-foreground-secondary)] border-l-2 border-[var(--color-accent)]/30 pl-4`}
                >
                  <CheckCircle
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
