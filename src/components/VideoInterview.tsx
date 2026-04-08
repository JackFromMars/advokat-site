"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Shield, Scale, Users, Gavel, Heart } from "lucide-react";

const theses = [
  {
    icon: BookOpen,
    text: "Постійно відстежує зміни законодавства в режимі реального часу — критично важливо у воєнний період",
  },
  {
    icon: Shield,
    text: "Знає вихід із найскладніших ситуацій — навіть без документів статус ВПО можна підтвердити за допомогою свідків",
  },
  {
    icon: Scale,
    text: "Захищає від незаконних відмов державних органів — адресна допомога не залежить від зарплати чи наявності майна",
  },
  {
    icon: Gavel,
    text: "Практичний досвід оскарження — поновлення виплат через суд при незаконній відмові",
  },
  {
    icon: Users,
    text: "Індивідуальний підхід — кожен випадок окремий, без шаблонних рішень",
  },
  {
    icon: Heart,
    text: "Поєднує теоретичні знання з практичними порадами — реальний помічник, а не просто консультант",
  },
];

export default function VideoInterview() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    const reveals = section.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="reveal stagger-1 eyebrow inline-block mb-4">
            Інтерв&apos;ю
          </span>
          <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
            Дізнайтеся більше{" "}
            <span className="gold-gradient">про мене</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — Video */}
          <div className="reveal stagger-2">
            <div className="card overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                {isVisible ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/YxKnqyUp3rE?rel=0&modestbranding=1"
                    title="Інтерв'ю з адвокатом Левченко Наталією Вікторівною"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--color-bg-card)]" />
                )}
              </div>
            </div>
            <p className="text-[var(--color-muted)] text-sm mt-4 text-center md:text-left">
              Інтерв&apos;ю про права внутрішньо переміщених осіб та соціальні виплати
            </p>
          </div>

          {/* Right — Key theses */}
          <div className="space-y-4">
            <h3 className="reveal stagger-3 font-heading text-xl md:text-2xl font-semibold text-[var(--color-foreground)] mb-6">
              Ключові тези з інтерв&apos;ю
            </h3>

            {theses.map((thesis, i) => {
              const Icon = thesis.icon;
              return (
                <div
                  key={i}
                  className={`reveal stagger-${Math.min(i + 3, 8)} flex items-start gap-4`}
                >
                  <div
                    className="icon-container shrink-0 mt-0.5"
                  >
                    <Icon size={16} className="text-[var(--color-accent)]" />
                  </div>
                  <p className="text-[var(--color-foreground-secondary)] text-sm md:text-base leading-relaxed">
                    {thesis.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
