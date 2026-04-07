"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/data/faq";

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({
  items,
  title = "Часті питання",
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const reveals = section.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="section-glow py-20 md:py-28 lg:py-32"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="reveal stagger-1">
            <span className="eyebrow">Питання та відповіді</span>
          </div>
          <h2 className="reveal stagger-2 font-heading text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mt-4">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gold-gradient">
              {title.split(" ").slice(-1)[0]}
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3 md:space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const staggerClass = `stagger-${Math.min(index + 3, 8)}`;

            return (
              <div
                key={index}
                className={`reveal ${staggerClass} card-premium`}
              >
                <div className="card-premium-inner">
                  <button
                    type="button"
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 min-h-[56px] cursor-pointer"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    style={{
                      transition: "transform 150ms cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: undefined,
                    }}
                    onPointerDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.99)";
                    }}
                    onPointerUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                    onPointerLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                  >
                    <span className="font-heading text-base md:text-lg text-[var(--color-foreground)]">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className="flex-shrink-0"
                      style={{
                        color: "var(--color-accent)",
                        transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 300ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5">
                        <div className="separator mb-4" />
                        <p className="text-[var(--color-foreground-secondary)] text-sm md:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
