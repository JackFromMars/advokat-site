"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

interface ContactFormProps {
  variant?: "hero" | "section";
}

export default function ContactForm({ variant = "section" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15 }
    );

    const reveals = section.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  function validate(): boolean {
    const errors: { name?: string; phone?: string } = {};
    if (!name.trim()) errors.name = "Введіть ваше ім'я";
    if (!phone.trim()) errors.phone = "Введіть номер телефону";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
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

  const inputClasses =
    "w-full px-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]/40 focus:ring-1 focus:ring-[var(--color-accent)]/20";

  const inputTransition: React.CSSProperties = {
    transition: "border-color 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1)",
  };

  if (status === "sent") {
    const successContent = (
      <div className="py-8 text-center">
        <div
          className="icon-container mx-auto mb-4"
          style={{
            animation: "fadeInScale 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
          }}
        >
          <Check size={20} />
        </div>
        <p className="text-[var(--color-foreground)] font-heading font-medium text-lg">
          Дякую за звернення!
        </p>
        <p className="text-[var(--color-foreground-secondary)] text-sm mt-2">
          Зв&apos;яжуся з вами протягом години
        </p>
      </div>
    );

    if (variant === "hero") {
      return (
        <div ref={sectionRef} className="max-w-sm">
          <div className="card-premium">
            <div className="card-premium-inner p-4 md:p-6">
              {successContent}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={sectionRef} className="max-w-lg mx-auto">
        <div className="card-premium">
          <div className="card-premium-inner p-4 md:p-6">
            {successContent}
          </div>
        </div>
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {variant === "section" && (
        <div className="mb-6">
          <span className="eyebrow">Зв&apos;язатися</span>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-foreground)] mt-3">
            Залиште заявку — зателефоную протягом години
          </h3>
        </div>
      )}

      {variant === "hero" && (
        <h3 className="font-heading text-lg font-semibold text-[var(--color-foreground)] mb-2">
          Безкоштовна консультація
        </h3>
      )}

      {/* Name field */}
      <div>
        <input
          type="text"
          placeholder="Ваше ім'я"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
          }}
          required
          className={inputClasses}
          style={inputTransition}
        />
        {fieldErrors.name && (
          <p className="text-red-400 text-xs mt-1.5 ml-1">{fieldErrors.name}</p>
        )}
      </div>

      {/* Phone field */}
      <div>
        <input
          type="tel"
          placeholder="Ваш телефон"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
          }}
          required
          className={inputClasses}
          style={inputTransition}
        />
        {fieldErrors.phone && (
          <p className="text-red-400 text-xs mt-1.5 ml-1">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer w-full py-3 px-6 bg-[var(--color-accent)] text-[var(--color-bg-deep)] font-heading font-semibold rounded-full min-h-[48px] disabled:opacity-50"
        style={{
          transition: "filter 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 150ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
        }}
        onPointerUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
        }}
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

  if (variant === "hero") {
    return (
      <div ref={sectionRef} className="max-w-sm">
        <div className="card-premium">
          <div className="card-premium-inner p-4 md:p-6">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="max-w-lg mx-auto">
      <div className="reveal stagger-1 card-premium">
        <div className="card-premium-inner p-4 md:p-6">
          {formContent}
        </div>
      </div>
    </div>
  );
}
