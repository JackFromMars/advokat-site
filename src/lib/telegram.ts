interface ContactMessage {
  name: string;
  phone: string;
}

export async function sendToTelegram({ name, phone }: ContactMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram credentials not configured");
  }

  const time = new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });

  const text = [
    `📩 <b>Нова заявка з сайту</b>`,
    ``,
    `👤 <b>Ім'я:</b> ${escapeHtml(name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
    ``,
    `🕐 <b>Час:</b> ${time}`,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return res.json();
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
