"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check } from "lucide-react";

interface ContactFormProps {
  variant?: "hero" | "section";
}

const PHONE_PREFIX = "+38 ";

function formatDigits(d: string): string {
  let formatted = "+38";
  if (d.length > 0) formatted += " (0" + d.slice(0, 2);
  if (d.length >= 2) formatted += ") ";
  if (d.length > 2) formatted += d.slice(2, 5);
  if (d.length > 5) formatted += "-" + d.slice(5, 7);
  if (d.length > 7) formatted += "-" + d.slice(7, 9);
  return formatted;
}

function extractSubscriberDigits(value: string): string {
  const allDigits = value.replace(/\D/g, "");
  let d = allDigits;
  if (d.startsWith("380")) d = d.slice(3);
  else if (d.startsWith("80")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 9);
}

/** Map a cursor position in formatted string to the digit index it sits after */
function cursorToDigitIndex(formatted: string, cursor: number): number {
  let digitIndex = 0;
  // Count subscriber digits before cursor
  // First skip the "+38" prefix digits
  let prefixDigitsToSkip = 2; // "3" and "8"
  for (let i = 0; i < cursor && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      if (prefixDigitsToSkip > 0) {
        prefixDigitsToSkip--;
      } else {
        digitIndex++;
      }
    }
  }
  return digitIndex;
}

/** Map a digit index back to cursor position in formatted string */
function digitIndexToCursor(formatted: string, targetDigitIndex: number): number {
  let digitIndex = 0;
  let prefixDigitsToSkip = 2; // "3" and "8"
  for (let i = 0; i < formatted.length; i++) {
    if (digitIndex >= targetDigitIndex) return i;
    if (/\d/.test(formatted[i])) {
      if (prefixDigitsToSkip > 0) {
        prefixDigitsToSkip--;
      } else {
        digitIndex++;
      }
    }
  }
  return formatted.length;
}

function toE164(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length === 12) return "+" + digits;
  return "";
}

export default function ContactForm({ variant = "section" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loadTime] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  // Restore cursor position after React re-renders the formatted value
  useEffect(() => {
    if (pendingCursor.current !== null && phoneRef.current) {
      const pos = pendingCursor.current;
      phoneRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  }, [phone]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawValue = input.value;
    const cursorPos = input.selectionStart ?? rawValue.length;

    const newDigits = extractSubscriberDigits(rawValue);
    const formatted = formatDigits(newDigits);

    // Figure out where cursor should land in the new formatted string
    const digitIdx = cursorToDigitIndex(rawValue, cursorPos);
    const newCursorPos = digitIndexToCursor(formatted, digitIdx);

    pendingCursor.current = newCursorPos;
    setPhone(formatted);
    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
  }, [fieldErrors.phone]);

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;

    const input = e.currentTarget;
    const cursor = input.selectionStart ?? 0;
    const selEnd = input.selectionEnd ?? 0;

    // If there's a selection, let default behavior handle it
    if (cursor !== selEnd) return;

    // Don't delete into the "+38 " prefix
    if (cursor <= PHONE_PREFIX.length) {
      e.preventDefault();
      return;
    }

    const currentFormatted = phone;
    const charBeforeCursor = currentFormatted[cursor - 1];

    // If the character before cursor is a formatting char (not a digit),
    // we need to skip back to the previous digit and delete it
    if (charBeforeCursor && !/\d/.test(charBeforeCursor)) {
      e.preventDefault();

      // Find the digit index that sits just before the cursor
      const digitIdx = cursorToDigitIndex(currentFormatted, cursor);
      if (digitIdx <= 0) return; // nothing to delete

      // Remove that digit
      const digits = extractSubscriberDigits(currentFormatted);
      const newDigits = digits.slice(0, digitIdx - 1) + digits.slice(digitIdx);
      const newFormatted = formatDigits(newDigits);

      // Place cursor after the digit before the one we removed
      const newCursorPos = digitIndexToCursor(newFormatted, digitIdx - 1);
      pendingCursor.current = newCursorPos;
      setPhone(newFormatted);
    }
  }, [phone]);

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
    if (!name.trim() || name.trim().length < 2) errors.name = "Введіть ваше ім'я";
    const e164 = toE164(phone);
    if (!e164) errors.phone = "Введіть коректний номер телефону";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Silent reject for bots that submit too fast
    if (Date.now() - loadTime < 2000) {
      setStatus("sent");
      setName("");
      setPhone("");
      return;
    }

    if (!validate()) return;

    setStatus("sending");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: toE164(phone),
          _hp: honeypot,
          _ts: loadTime,
        }),
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
        <div ref={sectionRef}>
          <div className="card p-5 md:p-7">
            {successContent}
          </div>
        </div>
      );
    }

    return (
      <div ref={sectionRef} className="max-w-lg mx-auto">
        <div className="card p-4 md:p-6">
          {successContent}
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

      {/* Honeypot - hidden from humans */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

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
          ref={phoneRef}
          type="tel"
          placeholder="+38 (0XX) XXX-XX-XX"
          value={phone}
          onChange={handlePhoneChange}
          onKeyDown={handlePhoneKeyDown}
          maxLength={19}
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
      <div ref={sectionRef}>
        <div className="card p-5 md:p-7">
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="max-w-lg mx-auto">
      <div className="reveal stagger-1 card p-4 md:p-6">
        {formContent}
      </div>
    </div>
  );
}
