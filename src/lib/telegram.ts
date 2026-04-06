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

  const text = [
    "📩 *Нова заявка з сайту*",
    "",
    `👤 *Ім'я:* ${escapeMarkdown(name)}`,
    `📞 *Телефон:* ${escapeMarkdown(phone)}`,
    "",
    `🕐 *Час:* ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return res.json();
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
