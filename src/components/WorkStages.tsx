"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, FileSearch, Target, Scale, CheckCircle, ShieldCheck } from "lucide-react";

const stages = [
  {
    icon: MessageSquare,
    title: "Безкоштовна консультація",
    description: "Аналізую вашу ситуацію, відповідаю на питання та оцінюю перспективи справи. Без зобов'язань.",
  },
  {
    icon: FileSearch,
    title: "Аналіз документів",
    description: "Вивчаю всі матеріали справи, збираю докази, визначаю сильні та слабкі сторони позиції.",
  },
  {
    icon: Target,
    title: "Стратегія захисту",
    description: "Розробляю індивідуальну стратегію з урахуванням усіх обставин та судової практики.",
  },
  {
    icon: Scale,
    title: "Представництво в суді",
    description: "Повний супровід справи в суді: підготовка позовів, участь у засіданнях, подання клопотань.",
  },
  {
    icon: CheckCircle,
    title: "Результат",
    description: "Отримання рішення суду на вашу користь. Контроль його виконання до повного завершення.",
  },
  {
    icon: ShieldCheck,
    title: "Подальша підтримка",
    description: "Залишаюсь на зв'язку після завершення справи. Допоможу з будь-якими юридичними питаннями.",
  },
];

export default function WorkStages() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} className="section-glow py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="reveal stagger-1 eyebrow inline-block mb-4">Як це працює</span>
          <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
            Етапи <span className="gold-gradient">роботи</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.title}
                className={`reveal stagger-${Math.min(i + 1, 8)} card p-6 md:p-8 relative`}
              >
                {/* Step number watermark */}
                <div className="font-heading text-5xl font-bold text-[var(--color-accent)]/10 absolute top-4 right-5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="icon-container mb-5">
                  <Icon size={18} className="text-[var(--color-accent)]" />
                </div>

                <h3 className="font-heading text-lg font-semibold text-[var(--color-foreground)] mb-3">
                  {stage.title}
                </h3>
                <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
