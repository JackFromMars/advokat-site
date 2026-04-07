import Link from "next/link";
import Image from "next/image";
import { contacts } from "@/data/contacts";
import { navigation } from "@/data/navigation";
import {
  TelegramIcon,
  ViberIcon,
  WhatsAppIcon,
} from "@/components/icons/MessengerIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-deep)]">
      {/* Top separator */}
      <div className="separator" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo.svg"
              alt="Адвокат Левченко"
              width={140}
              height={40}
              className="mb-5 opacity-90"
            />
            <p className="text-[var(--color-muted)] text-sm leading-relaxed max-w-xs">
              Професійний захист ваших інтересів з {contacts.practiceStartYear}{" "}
              року. Індивідуальний підхід та конфіденційність у кожній справі.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[var(--color-foreground)] font-heading uppercase tracking-[0.1em] text-xs mb-5">
              Послуги
            </h4>
            <ul className="space-y-3">
              {navigation.services.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--color-foreground)] font-heading uppercase tracking-[0.1em] text-xs mb-5">
              Контакти
            </h4>
            <ul className="space-y-3 text-sm text-[var(--color-muted)]">
              <li>
                <a
                  href={`tel:${contacts.phoneRaw}`}
                  className="hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>{contacts.address}</li>
              <li className="flex items-center gap-4 pt-1">
                <a
                  href={contacts.messengers.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <TelegramIcon size={18} />
                </a>
                <a
                  href={contacts.messengers.viber}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Viber"
                  className="hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <ViberIcon size={18} />
                </a>
                <a
                  href={contacts.messengers.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[var(--color-foreground)] font-heading uppercase tracking-[0.1em] text-xs mb-5">
              Правова інформація
            </h4>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Усі права захищені. Інформація на сайті не є юридичною
              консультацією.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="separator mt-12 mb-0" />
        <div className="pt-8 text-center text-sm text-[var(--color-muted)]">
          &copy; {currentYear} {contacts.name}. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
