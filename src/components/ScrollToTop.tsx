"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Нагору"
      className="fixed left-4 bottom-20 z-30 w-11 h-11 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center cursor-pointer hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg-card-hover)] active:scale-[0.93]"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out), border-color 0.3s var(--ease-out), background-color 0.3s var(--ease-out)",
      }}
    >
      <ChevronUp size={18} className="text-[var(--color-foreground)]" />
    </button>
  );
}
