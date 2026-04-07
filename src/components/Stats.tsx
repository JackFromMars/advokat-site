"use client";

import { useEffect, useRef } from "react";
import { Award, Briefcase, TrendingUp, Clock } from "lucide-react";
import { stats } from "@/data/stats";
import HighlightCard from "@/components/HighlightCard";

const statIcons = [Award, Briefcase, TrendingUp, Clock];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-glow py-20 md:py-28 lg:py-32">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
          Чому обирають <span className="gold-gradient">мене</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];
            return (
              <HighlightCard key={stat.label}>
                <div className={`reveal stagger-${index + 1}`}>
                  <div className="card-premium">
                    <div className="card-premium-inner p-4 md:p-8 text-center">
                      <div className="icon-container mx-auto mb-4">
                        <Icon size={20} />
                      </div>
                      <div className="font-heading text-3xl md:text-4xl gold-gradient mb-2">
                        {stat.value}
                      </div>
                      <div className="text-[var(--color-foreground)] font-medium text-xs md:text-base mb-1">
                        {stat.label}
                      </div>
                      <div className="text-[var(--color-muted)] text-xs mt-1 hidden md:block">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </div>
              </HighlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
