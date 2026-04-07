"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Extract numeric part and suffix
  const numericMatch = value.match(/^(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const suffix = value.replace(/^\d+/, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || numericValue === 0) {
      if (started) setDisplay(value);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve
      const progress = 1 - Math.pow(1 - step / steps, 3);
      current = Math.round(numericValue * progress);
      setDisplay(current + suffix);

      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, numericValue, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {started ? display : "0" + suffix}
    </span>
  );
}
