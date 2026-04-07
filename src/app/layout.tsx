import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { generateLocalBusinessSchema } from "@/lib/schema";

const ebGaramond = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Адвокат у Чернівцях — Левченко Наталія Вікторівна",
    template: "%s | Адвокат Левченко Н.В.",
  },
  description:
    "Адвокат у Чернівцях з досвідом понад 23 роки. Сімейні справи, житлові суперечки, мобілізація. Професійний захист ваших інтересів.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://advokat.jackmars.com.ua"),
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "Адвокат Левченко Н.В.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema()),
          }}
        />
      </head>
      <body className={`${ebGaramond.variable} ${lato.variable} font-sans`}>
        <div className="noise-overlay" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
