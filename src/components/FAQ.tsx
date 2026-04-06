"use client";

import { useState } from "react";
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

  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="gold-gradient">
            {title.split(" ").slice(-1)[0]}
          </span>
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="glass overflow-hidden">
              <button
                type="button"
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 min-h-[44px]"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                aria-expanded={openIndex === index}
              >
                <span className="text-white font-medium text-sm md:text-base">
                  {item.question}
                </span>
                <span
                  className={`text-amber-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
