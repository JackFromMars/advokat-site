"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MessageSquare,
  FileSearch,
  Target,
  Scale,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

const stages = [
  {
    icon: MessageSquare,
    title: "Безкоштовна консультація",
    description:
      "Аналізую вашу ситуацію, відповідаю на питання та оцінюю перспективи справи. Без зобов'язань.",
  },
  {
    icon: FileSearch,
    title: "Аналіз документів",
    description:
      "Вивчаю всі матеріали справи, збираю докази, визначаю сильні та слабкі сторони позиції.",
  },
  {
    icon: Target,
    title: "Стратегія захисту",
    description:
      "Розробляю індивідуальну стратегію з урахуванням усіх обставин та судової практики.",
  },
  {
    icon: Scale,
    title: "Представництво в суді",
    description:
      "Повний супровід справи в суді: підготовка позовів, участь у засіданнях, подання клопотань.",
  },
  {
    icon: CheckCircle,
    title: "Результат",
    description:
      "Отримання рішення суду на вашу користь. Контроль його виконання до повного завершення.",
  },
  {
    icon: ShieldCheck,
    title: "Подальша підтримка",
    description:
      "Залишаюсь на зв'язку після завершення справи. Допоможу з будь-якими юридичними питаннями.",
  },
];

export default function WorkStages() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(
    stages.map(() => false)
  );

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Calculate how far through the section we've scrolled
    // Start when section enters viewport, end when it leaves
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const startOffset = vh * 0.7; // start filling when top is 70% down viewport
    const endOffset = vh * 0.2; // finish when bottom is 20% from top

    const scrolled = startOffset - sectionTop;
    const totalRange = sectionHeight - endOffset;
    const pct = Math.max(0, Math.min(1, scrolled / totalRange));

    setProgress(pct);

    // Determine which steps are active based on progress
    const stepCount = stages.length;
    const newActive = stages.map(
      (_, i) => pct >= (i + 0.3) / stepCount
    );
    setActiveSteps(newActive);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reveal observer for header
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

  return (
    <section
      ref={sectionRef}
      className="section-glow py-20 md:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="reveal stagger-1 eyebrow inline-block mb-4">
            Як це працює
          </span>
          <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
            Етапи <span className="gold-gradient">роботи</span>
          </h2>
        </div>

        {/* ── Timeline ── */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Vertical line track (grey) */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]"
            style={{ transform: "translateX(-50%)" }}
          />

          {/* Vertical line fill (gold, animated) */}
          <div
            className="absolute left-6 md:left-1/2 top-0 w-px origin-top"
            style={{
              height: `${progress * 100}%`,
              background:
                "linear-gradient(to bottom, var(--color-accent), var(--color-accent-light))",
              transform: "translateX(-50%)",
              transition: "height 100ms linear",
            }}
          />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const isActive = activeSteps[i];
              const isEven = i % 2 === 0;

              return (
                <div
                  key={stage.title}
                  className="relative flex items-start md:items-center"
                >
                  {/* ── Dot on timeline ── */}
                  <div
                    className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full border-2 z-10"
                    style={{
                      transform: "translate(-50%, 0)",
                      borderColor: isActive
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                      backgroundColor: isActive
                        ? "var(--color-accent)"
                        : "var(--color-bg-deep)",
                      boxShadow: isActive
                        ? "0 0 12px rgba(201,168,76,0.4)"
                        : "none",
                      transition:
                        "border-color 0.4s var(--ease-out), background-color 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out)",
                    }}
                  />

                  {/* ── Content card ── */}
                  {/* Mobile: always right of line */}
                  {/* Desktop: alternating left/right */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven
                        ? "md:mr-auto md:pr-0 md:text-right"
                        : "md:ml-auto md:pl-0 md:text-left"
                    }`}
                  >
                    <div
                      className="card p-5 md:p-6"
                      style={{
                        opacity: isActive ? 1 : 0.4,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(8px)",
                        transition:
                          "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)",
                      }}
                    >
                      {/* Step number + icon row */}
                      <div
                        className={`flex items-center gap-3 mb-3 ${
                          isEven ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className="icon-container shrink-0"
                          style={{
                            borderColor: isActive
                              ? "var(--color-accent)"
                              : "var(--color-border)",
                            transition:
                              "border-color 0.4s var(--ease-out)",
                          }}
                        >
                          <Icon
                            size={16}
                            className="text-[var(--color-accent)]"
                          />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]/60">
                          Крок {i + 1}
                        </span>
                      </div>

                      <h3 className="font-heading text-base md:text-lg font-semibold text-[var(--color-foreground)] mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed">
                        {stage.description}
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
  );
}
