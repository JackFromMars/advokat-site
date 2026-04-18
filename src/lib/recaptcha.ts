/**
 * Google reCAPTCHA v3 server-side verification.
 * Score range: 0.0 (bot) — 1.0 (human). We reject below 0.5.
 */

const MIN_SCORE = 0.5;

export interface RecaptchaResult {
  success: boolean;
  score?: number;
  reason?: string;
}

export async function verifyRecaptcha(token: string, action: string): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // If reCAPTCHA not configured, allow through (dev/fallback)
  if (!secret) {
    return { success: true, reason: "not_configured" };
  }

  if (!token) {
    return { success: false, reason: "missing_token" };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, reason: "verification_failed", score: 0 };
    }

    if (data.action !== action) {
      return { success: false, reason: "action_mismatch", score: data.score };
    }

    if (data.score < MIN_SCORE) {
      return { success: false, reason: "low_score", score: data.score };
    }

    return { success: true, score: data.score };
  } catch {
    // Fail open on network errors (don't block real users)
    return { success: true, reason: "network_error" };
  }
}
