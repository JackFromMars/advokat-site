"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const GA_ID = "G-37YEXSP7NV";
const ADS_ID = "AW-17101928703";
const ADS_CONVERSION_LABEL = "Un4RCK6S_tEaEP_x6to_";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function Analytics() {
  const scrollTracked = useRef(false);
  const timeTracked = useRef(false);

  useEffect(() => {
    // ── Track tel: link clicks → TelClick ──
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        window.gtag?.("event", "TelClick", {
          send_to: GA_ID,
          event_category: "engagement",
          event_label: href,
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
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
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
export function trackFormConversion(phone: string) {
  // GA4 event
  window.gtag?.("event", "Form", {
    send_to: GA_ID,
    event_category: "conversion",
    event_label: "contact_form",
  });

  // Google Ads conversion
  window.gtag?.("event", "conversion", {
    send_to: `${ADS_ID}/${ADS_CONVERSION_LABEL}`,
  });

  // Enhanced conversions — send hashed user data
  window.gtag?.("set", "user_data", {
    phone_number: phone,
  });
}
