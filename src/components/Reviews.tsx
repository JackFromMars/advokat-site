"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { contacts } from "@/data/contacts";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { PlaceDetails } from "@/lib/google-places";

interface ReviewsProps {
  data: PlaceDetails | null;
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "var(--color-accent)" : "none"}
          stroke={s <= rating ? "var(--color-accent)" : "var(--color-muted)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function Reviews({ data }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Filter 3+ stars (defense in depth — also filtered server-side)
  const filteredReviews = data?.reviews.filter((r) => r.rating >= 3) ?? [];

  const next = useCallback(() => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  }, [filteredReviews.length]);

  const prev = useCallback(() => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length
    );
  }, [filteredReviews.length]);

  // Auto advance every 4 seconds
  useEffect(() => {
    if (isPaused || filteredReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, filteredReviews.length]);

  // Scroll to current card (within container only, no page jump)
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const card = container.children[currentIndex] as HTMLElement;
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  // Intersection observer for reveal animation
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

  if (!data || filteredReviews.length === 0) {
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
      className="section-glow py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 reveal">
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

        {/* Slider container */}
        <div
          className="relative reveal"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Prev arrow */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] items-center justify-center cursor-pointer hover:border-[var(--color-accent)] transition-colors duration-300 hidden md:flex"
          >
            <ChevronLeft
              size={18}
              className="text-[var(--color-foreground)]"
            />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] items-center justify-center cursor-pointer hover:border-[var(--color-accent)] transition-colors duration-300 hidden md:flex"
          >
            <ChevronRight
              size={18}
              className="text-[var(--color-foreground)]"
            />
          </button>

          {/* Cards overflow container */}
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {filteredReviews.map((review, i) => (
              <div
                key={i}
                className="card p-6 snap-start shrink-0 w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  {review.profilePhoto ? (
                    <img
                      src={review.profilePhoto}
                      alt={review.authorName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] font-heading font-bold text-sm shrink-0">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
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
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={
                        s <= review.rating ? "var(--color-accent)" : "none"
                      }
                      stroke={
                        s <= review.rating
                          ? "var(--color-accent)"
                          : "var(--color-muted)"
                      }
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed line-clamp-4">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {filteredReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i
                  ? "w-6 bg-[var(--color-accent)]"
                  : "w-1.5 bg-[var(--color-muted)]/30"
              }`}
            />
          ))}
        </div>

        {/* Google link */}
        <div className="text-center mt-8 reveal">
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 card cursor-pointer text-[var(--color-accent)] text-sm font-medium"
          >
            Усі відгуки в Google
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
