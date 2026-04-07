"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { contacts } from "@/data/contacts";
import type { PlaceDetails } from "@/lib/google-places";

interface ReviewsProps {
  data: PlaceDetails | null;
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <Star
            key={star}
            size={size}
            fill="var(--color-accent)"
            stroke="var(--color-accent)"
          />
        ) : (
          <Star
            key={star}
            size={size}
            stroke="var(--color-muted)"
            fill="none"
          />
        )
      )}
    </div>
  );
}

export default function Reviews({ data }: ReviewsProps) {
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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  if (!data || data.reviews.length === 0) {
    return (
      <section
        id="reviews"
        ref={sectionRef}
        className="section-glow py-20 md:py-28 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="reveal">
            <span className="eyebrow">Відгуки клієнтів</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="gold-gradient">Відгуки</span>
            </h2>
            <p className="text-[var(--color-foreground-secondary)] mb-8 max-w-md mx-auto">
              Подивіться, що кажуть клієнти про мою роботу на Google Maps
            </p>
            <a
              href={contacts.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 glass glass-hover text-[var(--color-accent)] font-medium rounded-full cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            >
              Читати відгуки в Google
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="section-glow py-20 md:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="eyebrow">Відгуки клієнтів</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-8">
            <span className="gold-gradient">Довіра</span> підтверджена
            результатом
          </h2>

          {/* Rating summary */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Stars rating={Math.round(data.rating)} size={22} />
              <span className="text-[var(--color-foreground)] text-2xl font-bold font-heading tabular-nums">
                {data.rating}
              </span>
            </div>
            <span className="text-[var(--color-muted)] text-sm tracking-wide">
              {data.totalReviews} відгуків у Google
            </span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {data.reviews.slice(0, 6).map((review, index) => (
            <div
              key={index}
              className={`reveal stagger-${index + 1} card p-6`}
            >
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm shrink-0">
                    {review.authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--color-foreground)] font-medium text-sm truncate">
                      {review.authorName}
                    </p>
                    <p className="text-[var(--color-muted)] text-xs">
                      {review.relativeTimeDescription}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-3">
                  <Stars rating={review.rating} />
                </div>

                {/* Text */}
                <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed line-clamp-4">
                  {review.text}
                </p>
            </div>
          ))}
        </div>

        {/* Google link */}
        <div className="text-center mt-12 reveal stagger-4">
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 glass glass-hover text-[var(--color-accent)] font-medium rounded-full cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ transitionTimingFunction: "var(--ease-out)" }}
          >
            Усі відгуки в Google
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
