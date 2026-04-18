/**
 * Content filter — detects common spam patterns.
 * Returns true if content is suspicious (should be rejected).
 */

// Common spam keywords (crypto, loans, SEO, adult, etc.)
const SPAM_KEYWORDS = [
  // Crypto/finance spam
  "bitcoin", "crypto", "forex", "binary option", "bybit", "binance",
  "invest", "trading", "trader", "earn money", "make money",
  // Loan/credit spam
  "кредит онлайн", "позика", "мфо", "микрозайм",
  // SEO/marketing spam
  "seo service", "backlink", "buy traffic", "promote your", "продвижение сайт",
  "рассылк", "рассылка", "база email", "ba3a клиент",
  // Adult
  "escort", "dating", "casino", "gambling", "bet365", "1xbet",
  // Generic spam patterns
  "click here", "visit my", "check my website", "мой сайт",
];

// Domain pattern — blocks obvious URLs
const URL_REGEX = /https?:\/\/|www\.|\.com|\.net|\.org|\.ru|\.xyz|\.site|\.club|\.info|\.biz|t\.me\/(?!advocatenlev)/i;

// Cyrillic text with excessive Latin (mixed script attacks)
const MIXED_SCRIPT_REGEX = /[а-яА-ЯіїєґІЇЄҐ].*[a-zA-Z]{5,}|[a-zA-Z]{5,}.*[а-яА-ЯіїєґІЇЄҐ]/;

// Repetitive character pattern (aaaaa, 11111)
const REPEAT_REGEX = /(.)\1{5,}/;

export interface FilterResult {
  isSpam: boolean;
  reason?: string;
}

export function filterContent(name: string, message: string): FilterResult {
  const combined = `${name} ${message}`.toLowerCase();

  // Check URLs
  if (URL_REGEX.test(combined)) {
    return { isSpam: true, reason: "url_in_content" };
  }

  // Check spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (combined.includes(keyword.toLowerCase())) {
      return { isSpam: true, reason: `spam_keyword:${keyword}` };
    }
  }

  // Check mixed scripts in name (russian/ukrainian name shouldn't have English words)
  if (name.length > 4 && MIXED_SCRIPT_REGEX.test(name)) {
    return { isSpam: true, reason: "mixed_script_in_name" };
  }

  // Check repetitive characters
  if (REPEAT_REGEX.test(name) || REPEAT_REGEX.test(message)) {
    return { isSpam: true, reason: "repetitive_chars" };
  }

  // Name must contain at least one letter (Cyrillic or Latin)
  if (!/\p{L}/u.test(name)) {
    return { isSpam: true, reason: "no_letters_in_name" };
  }

  // Message length limits (too long = likely spam)
  if (message.length > 1000) {
    return { isSpam: true, reason: "message_too_long" };
  }

  return { isSpam: false };
}
