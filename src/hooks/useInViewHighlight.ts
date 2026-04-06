"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewHighlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    // Only apply on mobile (< 768px)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHighlighted(entry.isIntersecting);
      },
      {
        // rootMargin creates a narrow band in the middle of the viewport
        // Top margin: -35% means ignore top 35%
        // Bottom margin: -35% means ignore bottom 35%
        // This leaves a ~30% "active zone" in the center
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isHighlighted };
}
