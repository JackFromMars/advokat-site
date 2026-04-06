import { NextResponse } from "next/server";
import { sendToTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Ім'я та телефон обов'язкові" },
        { status: 400 }
      );
    }

    if (name.length > 100 || phone.length > 20) {
      return NextResponse.json(
        { error: "Невірні дані" },
        { status: 400 }
      );
    }

    await sendToTelegram({ name, phone });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Помилка відправки" },
      { status: 500 }
    );
  }
}
