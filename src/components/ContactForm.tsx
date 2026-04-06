"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ContactFormProps {
  variant?: "hero" | "section";
}

export default function ContactForm({ variant = "section" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setPhone("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className={`bg-[var(--color-glass)] border border-[var(--color-border)] rounded-2xl p-6 text-center ${variant === "hero" ? "max-w-sm" : ""}`}
      >
        <div className="icon-container mx-auto mb-2">
          <Check size={20} />
        </div>
        <p className="text-white font-medium">Дякую за звернення!</p>
        <p className="text-slate-400 text-sm mt-1">
          Зв'яжуся з вами протягом години
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[var(--color-glass)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4 ${variant === "hero" ? "max-w-sm" : "max-w-lg mx-auto"}`}
    >
      <h3 className="font-heading text-lg font-semibold text-white">
        {variant === "hero"
          ? "Безкоштовна консультація"
          : "Залиште заявку — зателефоную протягом години"}
      </h3>
      <input
        type="text"
        placeholder="Ваше ім'я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/50 transition-colors duration-200"
      />
      <input
        type="tel"
        placeholder="Ваш телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/50 transition-colors duration-200"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 min-h-[44px]"
      >
        {status === "sending"
          ? "Надсилаю..."
          : "Отримати безкоштовну консультацію"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Помилка. Зателефонуйте нам напряму.
        </p>
      )}
    </form>
  );
}
