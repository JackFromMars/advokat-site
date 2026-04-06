import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateLocalBusinessSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
