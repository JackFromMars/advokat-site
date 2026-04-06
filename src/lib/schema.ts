import { contacts } from "@/data/contacts";
import type { Service } from "@/data/services";
import type { FAQItem } from "@/data/faq";

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Attorney", "LocalBusiness"],
    name: contacts.name,
    description:
      "Адвокат у Чернівцях з досвідом понад 23 роки. Сімейні справи, житлові суперечки, мобілізація.",
    url: "https://advokat.jackmars.com.ua",
    telephone: contacts.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: "вул. Небесної Сотні, 19",
      addressLocality: "Чернівці",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.2908,
      longitude: 25.9353,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  };
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Attorney",
      name: contacts.name,
      telephone: contacts.phoneRaw,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Чернівці",
        addressCountry: "UA",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Чернівці",
    },
  };
}
