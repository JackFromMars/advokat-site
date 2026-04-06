import Link from "next/link";
import { contacts } from "@/data/contacts";
import { navigation } from "@/data/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold gold-gradient mb-4">
              Адвокат Левченко Н.В.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Професійний захист ваших інтересів з 2003 року. Сімейні справи,
              житлові суперечки, мобілізація.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Послуги
            </h4>
            <ul className="space-y-2">
              {navigation.services.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Контакти
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href={`tel:${contacts.phoneRaw}`}
                  className="hover:text-white transition-colors"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>{contacts.address}</li>
              <li className="flex gap-4 pt-2">
                <a
                  href={contacts.messengers.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={contacts.messengers.viber}
                  className="hover:text-white transition-colors"
                >
                  Viber
                </a>
                <a
                  href={contacts.messengers.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          © {currentYear} {contacts.name}. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
