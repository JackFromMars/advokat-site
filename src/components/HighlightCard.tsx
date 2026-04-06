"use client";

import { useInViewHighlight } from "@/hooks/useInViewHighlight";

interface HighlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function HighlightCard({ children, className = "" }: HighlightCardProps) {
  const { ref, isHighlighted } = useInViewHighlight();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${className}`}
      style={{
        opacity: isHighlighted ? 1 : 0.4,
        transform: isHighlighted ? "scale(1)" : "scale(0.97)",
        filter: isHighlighted ? "brightness(1)" : "brightness(0.7)",
      }}
    >
      {children}
    </div>
  );
}
