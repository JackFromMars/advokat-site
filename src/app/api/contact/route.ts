import { NextResponse } from "next/server";
import { sendToTelegram } from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { filterContent } from "@/lib/content-filter";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Невірний формат запиту" }, { status: 415 });
  }

  // ── Rate limit by IP (3 per hour) ──
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    // Silent success — bot will think it worked, won't retry aggressively
    return NextResponse.json({ success: true });
  }

  try {
    const body = await request.json();
    const { name, phone, message, page, recaptchaToken, _hp, _hp2, _ts } = body;

    // ── Honeypot checks (silent success) ──
    if (_hp || _hp2) {
      return NextResponse.json({ success: true });
    }

    // ── Timestamp check — too fast = bot (5 seconds min) ──
    if (_ts && Date.now() - _ts < 5000) {
      return NextResponse.json({ success: true });
    }

    // ── Timestamp too old (> 2 hours) — stale form ──
    if (_ts && Date.now() - _ts > 2 * 60 * 60 * 1000) {
      return NextResponse.json({ success: true });
    }

    // ── Field validation ──
    if (!name || !phone) {
      return NextResponse.json({ error: "Ім'я та телефон обов'язкові" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Невірне ім'я" }, { status: 400 });
    }

    if (!/^\+380\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Невірний номер телефону" }, { status: 400 });
    }

    // ── Content filter ──
    const filter = filterContent(name, message || "");
    if (filter.isSpam) {
      console.warn(`Spam blocked: ${filter.reason} (IP: ${ip}, name: ${name})`);
      return NextResponse.json({ success: true });
    }

    // ── reCAPTCHA v3 verification ──
    const recaptcha = await verifyRecaptcha(recaptchaToken, "contact_form");
    if (!recaptcha.success) {
      console.warn(`reCAPTCHA failed: ${recaptcha.reason} score=${recaptcha.score} (IP: ${ip})`);
      return NextResponse.json({ success: true });
    }

    await sendToTelegram({ name, phone, message: message || "", page: page || "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Помилка відправки" }, { status: 500 });
  }
}
