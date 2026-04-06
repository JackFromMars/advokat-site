import Image from "next/image";
import { contacts } from "@/data/contacts";
import ContactForm from "./ContactForm";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-amber-400 font-medium mb-4 text-sm uppercase tracking-wider">
              Адвокат у Чернівцях з 2003 року
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Захищу ваші права{" "}
              <span className="gold-gradient">професійно</span> та{" "}
              <span className="gold-gradient">результативно</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Юридичні проблеми не чекають — і я теж. Від першої консультації до
              рішення суду на вашому боці. Понад 23 роки успішної практики.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-amber-400/30">
                <Image
                  src="/images/photo.jpg"
                  alt={contacts.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{contacts.name}</p>
                <p className="text-slate-400 text-sm">Адвокат • з 2003 року</p>
              </div>
            </div>

            <a
              href={`tel:${contacts.phoneRaw}`}
              className="lg:hidden inline-flex items-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors min-h-[44px]"
            >
              📞 Зателефонувати
            </a>
          </div>

          <div className="hidden lg:block">
            <ContactForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
