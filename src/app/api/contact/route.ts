import { NextResponse } from "next/server";
import { sendToTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Невірний формат запиту" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { name, phone, message, page, _hp, _ts } = body;

    // Honeypot check — silent success for bots
    if (_hp) {
      return NextResponse.json({ success: true });
    }

    // Timestamp check — too fast = bot
    if (_ts && Date.now() - _ts < 2000) {
      return NextResponse.json({ success: true });
    }

    if (!name || !phone) {
      return NextResponse.json({ error: "Ім'я та телефон обов'язкові" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Невірне ім'я" }, { status: 400 });
    }

    // Validate E.164 Ukrainian phone
    if (!/^\+380\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Невірний номер телефону" }, { status: 400 });
    }

    await sendToTelegram({ name, phone, message: message || "", page: page || "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Помилка відправки" }, { status: 500 });
  }
}
