import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
