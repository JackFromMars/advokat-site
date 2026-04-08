interface ContactMessage {
  name: string;
  phone: string;
  message?: string;
  page?: string;
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Головна",
  "/simejni-spravy": "Сімейні справи",
  "/zhytlovi-superechky": "Житлові суперечки",
  "/mobilizatsiya": "Мобілізація",
  "/kredyty-ta-borhy": "Кредити та борги",
  "/mihratsijne-pravo": "Міграційне право",
  "/korporatyvne-pravo": "Корпоративне право",
  "/zemelne-ta-ahrarne-pravo": "Земельне та аграрне право",
  "/administratyvni-spravy": "Адміністративні справи",
};

export async function sendToTelegram({ name, phone, message, page }: ContactMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram credentials not configured");
  }

  const time = new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
  const pageName = PAGE_NAMES[page || "/"] || page || "Головна";

  const lines = [
    `📩 <b>Нова заявка з сайту</b>`,
    ``,
    `👤 <b>Ім'я:</b> ${escapeHtml(name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
  ];

  if (message) {
    lines.push(`💬 <b>Повідомлення:</b> ${escapeHtml(message)}`);
  }

  lines.push(``);
  lines.push(`📄 <b>Сторінка:</b> ${escapeHtml(pageName)}`);
  lines.push(`🕐 <b>Час:</b> ${time}`);

  const text = lines.join("\n");

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
