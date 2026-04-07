"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Check } from "lucide-react";

interface ContactFormProps {
  variant?: "hero" | "section";
}

/* ── Phone mask helpers ──
   State stores only subscriber digits (up to 9), e.g. "951234567".
   The "0" prefix and "+38" are added automatically during formatting.
   Format: +38 (0XX) XXX-XX-XX
*/

function formatSubscriber(d: string): string {
  if (d.length === 0) return "";
  let f = "+38 (0" + d.slice(0, 2);
  if (d.length >= 2) f += ") ";
  if (d.length > 2) f += d.slice(2, 5);
  if (d.length > 5) f += "-" + d.slice(5, 7);
  if (d.length > 7) f += "-" + d.slice(7, 9);
  return f;
}

/** Build a map: digit index → position AFTER that digit in the formatted string */
function buildDigitPositions(formatted: string): number[] {
  const positions: number[] = [];
  // Skip fixed chars: +, 3, 8, space, (, 0 — first real digit is at index 6
  let skippedFixed = 0; // skip "3", "8", "0"
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      if (skippedFixed < 3) {
        skippedFixed++;
      } else {
        positions.push(i + 1); // position AFTER this digit
      }
    }
  }
  return positions;
}

/** Convert a cursor position in the formatted string to a digit index (0-based) */
function cursorToDigitIdx(formatted: string, cursor: number): number {
  let idx = 0;
  let skippedFixed = 0;
  for (let i = 0; i < cursor && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      if (skippedFixed < 3) {
        skippedFixed++;
      } else {
        idx++;
      }
    }
  }
  return idx;
}

function toE164(digits: string): string {
  if (digits.length === 9) return "+380" + digits;
  return "";
}

export default function ContactForm({ variant = "section" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [digits, setDigits] = useState(""); // subscriber digits only, max 9
  const [honeypot, setHoneypot] = useState("");
  const [loadTime] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  const phoneDisplay = useMemo(() => formatSubscriber(digits), [digits]);

  // Restore cursor after React re-renders
  useEffect(() => {
    if (pendingCursor.current !== null && phoneRef.current) {
      const pos = pendingCursor.current;
      phoneRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  }, [phoneDisplay]);

  const setCursorAfterDigit = useCallback((newDigits: string, digitIdx: number) => {
    const formatted = formatSubscriber(newDigits);
    const positions = buildDigitPositions(formatted);
    if (digitIdx <= 0) {
      // Before any subscriber digit — put cursor right after "(0"
      pendingCursor.current = formatted.indexOf("(0") !== -1 ? formatted.indexOf("(0") + 2 : 0;
    } else if (digitIdx > positions.length) {
      pendingCursor.current = formatted.length;
    } else {
      pendingCursor.current = positions[digitIdx - 1];
    }
  }, []);

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursor = input.selectionStart ?? 0;
    const selEnd = input.selectionEnd ?? 0;
    const formatted = phoneDisplay;

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      if (digits.length >= 9) return;

      const digitIdx = cursorToDigitIdx(formatted, cursor);
      const newDigits = digits.slice(0, digitIdx) + e.key + digits.slice(digitIdx);
      setCursorAfterDigit(newDigits, digitIdx + 1);
      setDigits(newDigits);
      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (cursor !== selEnd) {
        // Selection: delete all digits in range
        const startIdx = cursorToDigitIdx(formatted, cursor);
        const endIdx = cursorToDigitIdx(formatted, selEnd);
        if (startIdx === endIdx) return;
        const newDigits = digits.slice(0, startIdx) + digits.slice(endIdx);
        setCursorAfterDigit(newDigits, startIdx);
        setDigits(newDigits);
      } else {
        const digitIdx = cursorToDigitIdx(formatted, cursor);
        if (digitIdx <= 0) return;
        const newDigits = digits.slice(0, digitIdx - 1) + digits.slice(digitIdx);
        setCursorAfterDigit(newDigits, digitIdx - 1);
        setDigits(newDigits);
      }
      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      if (cursor !== selEnd) {
        const startIdx = cursorToDigitIdx(formatted, cursor);
        const endIdx = cursorToDigitIdx(formatted, selEnd);
        if (startIdx === endIdx) return;
        const newDigits = digits.slice(0, startIdx) + digits.slice(endIdx);
        setCursorAfterDigit(newDigits, startIdx);
        setDigits(newDigits);
      } else {
        const digitIdx = cursorToDigitIdx(formatted, cursor);
        if (digitIdx >= digits.length) return;
        const newDigits = digits.slice(0, digitIdx) + digits.slice(digitIdx + 1);
        setCursorAfterDigit(newDigits, digitIdx);
        setDigits(newDigits);
      }
      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
      return;
    }

    // Allow navigation keys, tab, etc.
    if (["ArrowLeft", "ArrowRight", "Home", "End", "Tab"].includes(e.key)) return;

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) return;

    // Block everything else
    e.preventDefault();
  }, [digits, phoneDisplay, fieldErrors.phone, setCursorAfterDigit]);

  // Handle paste
  const handlePhonePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const pastedDigits = pasted.replace(/\D/g, "");
    let d = pastedDigits;
    if (d.startsWith("380")) d = d.slice(3);
    else if (d.startsWith("80")) d = d.slice(2);
    else if (d.startsWith("0")) d = d.slice(1);

    const input = e.currentTarget;
    const cursor = input.selectionStart ?? 0;
    const selEnd = input.selectionEnd ?? 0;
    const startIdx = cursorToDigitIdx(phoneDisplay, cursor);
    const endIdx = cursorToDigitIdx(phoneDisplay, selEnd);

    const before = digits.slice(0, startIdx);
    const after = digits.slice(endIdx);
    const newDigits = (before + d + after).slice(0, 9);

    setCursorAfterDigit(newDigits, Math.min(startIdx + d.length, newDigits.length));
    setDigits(newDigits);
    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
  }, [digits, phoneDisplay, fieldErrors.phone, setCursorAfterDigit]);

  // onChange is a no-op — all input handled via onKeyDown/onPaste
  const handlePhoneChange = useCallback(() => {}, []);

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
    const e164 = toE164(digits);
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
      setDigits("");
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
          phone: toE164(digits),
          _hp: honeypot,
          _ts: loadTime,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setDigits("");
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
          value={phoneDisplay}
          onChange={handlePhoneChange}
          onKeyDown={handlePhoneKeyDown}
          onPaste={handlePhonePaste}
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
