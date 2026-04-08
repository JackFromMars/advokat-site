"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const GA_ID = "G-37YEXSP7NV";
const ADS_ID = "AW-17101928703";
const ADS_FORM_LABEL = "Un4RCK6S_tEaEP_x6to_";
const ADS_TELCLICK_LABEL = "sSGSCM7EmpgcEP_x6to_";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function Analytics() {
  const scrollTracked = useRef(false);
  const timeTracked = useRef(false);
  const videoTracked = useRef(false);

  useEffect(() => {
    // ── Track tel: link clicks → TelClick ──
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        // GA4 event
        window.gtag?.("event", "TelClick", {
          send_to: GA_ID,
          event_category: "engagement",
          event_label: href,
        });
        // Google Ads conversion
        window.gtag?.("event", "conversion", {
          send_to: `${ADS_ID}/${ADS_TELCLICK_LABEL}`,
          value: 500,
          currency: "UAH",
        });
      }

      // Messenger clicks
      if (href.includes("t.me/") || href.includes("telegram")) {
        window.gtag?.("event", "click_telegram", {
          send_to: GA_ID,
          event_category: "messenger",
          event_label: href,
        });
      }
      if (href.includes("viber://")) {
        window.gtag?.("event", "click_viber", {
          send_to: GA_ID,
          event_category: "messenger",
          event_label: href,
        });
      }
      if (href.includes("wa.me/") || href.includes("whatsapp")) {
        window.gtag?.("event", "click_whatsapp", {
          send_to: GA_ID,
          event_category: "messenger",
          event_label: href,
        });
      }

      // Google Maps click
      if (href.includes("maps.app.goo.gl") || href.includes("google.com/maps") || href.includes("goo.gl/maps")) {
        window.gtag?.("event", "click_map", {
          send_to: GA_ID,
          event_category: "engagement",
          event_label: href,
        });
      }

      // CTA call button (distinguished from regular tel links by button text/class)
      const buttonText = target.textContent?.trim() || "";
      if (href.startsWith("tel:") && (buttonText.includes("консультац") || buttonText.includes("Консультац"))) {
        window.gtag?.("event", "click_cta_call", {
          send_to: GA_ID,
          event_category: "conversion",
          event_label: buttonText,
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    // ── Track YouTube video play via iframe focus detection ──
    function handleBlur() {
      if (videoTracked.current) return;
      setTimeout(() => {
        const active = document.activeElement;
        if (active && active.tagName === "IFRAME" && (active as HTMLIFrameElement).src?.includes("youtube")) {
          videoTracked.current = true;
          window.gtag?.("event", "video_play", {
            send_to: GA_ID,
            event_category: "engagement",
            event_label: "interview",
          });
        }
      }, 100);
    }

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  useEffect(() => {
    // ── Track 50% page scroll → PageScroll ──
    function handleScroll() {
      if (scrollTracked.current) return;
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50) {
        scrollTracked.current = true;
        window.gtag?.("event", "PageScroll", {
          send_to: GA_ID,
          event_category: "engagement",
          event_label: "50%",
          value: 50,
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // ── Track 15 seconds on page → TimeOnPage ──
    const timer = setTimeout(() => {
      if (timeTracked.current) return;
      timeTracked.current = true;
      window.gtag?.("event", "TimeOnPage", {
        send_to: GA_ID,
        event_category: "engagement",
        event_label: "15s",
        value: 15,
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Google tag (gtag.js) — GA4 + Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Google Consent Mode V2 — default granted
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
          });

          // GA4
          gtag('config', '${GA_ID}', {
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure'
          });

          // Google Ads with enhanced conversions
          gtag('config', '${ADS_ID}', {
            allow_enhanced_conversions: true
          });
        `}
      </Script>
    </>
  );
}

/**
 * Call this when the contact form is successfully submitted.
 * Sends both GA4 event and Google Ads conversion.
 */
export function trackFormConversion(phone: string, name?: string) {
  // 1. Set enhanced conversion user data BEFORE sending conversion
  window.gtag?.("set", "user_data", {
    phone_number: phone,
  });

  // 2. GA4 event
  window.gtag?.("event", "Form", {
    send_to: GA_ID,
    event_category: "conversion",
    event_label: "contact_form",
  });

  // 3. Google Ads conversion with value matching Ads settings
  window.gtag?.("event", "conversion", {
    send_to: `${ADS_ID}/${ADS_FORM_LABEL}`,
    value: 500,
    currency: "UAH",
  });
}
