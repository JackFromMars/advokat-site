import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { primaryServices, secondaryServices } from "@/data/services";
import ServiceIcon from "@/components/icons/ServiceIcons";
import HighlightCard from "@/components/HighlightCard";

export default function ServicesGrid() {
  return (
    <section id="services" className="py-12 md:py-20 section-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]">
        <Image src="/images/services-bg.png" alt="" fill className="object-cover" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Основні <span className="gold-gradient">послуги</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Спеціалізуюся на найбільш затребуваних напрямках юридичної практики
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {primaryServices.map((service) => (
            <HighlightCard key={service.slug}>
              <Link
                href={`/${service.slug}`}
                className="glass glass-hover p-5 md:p-8 group cursor-pointer block"
              >
                <div className="icon-container-lg mb-4">
                  <ServiceIcon slug={service.slug} size={28} />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-1.5">
                  {service.subServices.slice(0, 3).map((sub) => (
                    <li
                      key={sub.title}
                      className="text-xs text-slate-500 flex items-start gap-2"
                    >
                      <span
                        className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      />
                      {sub.title}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150">
                  Детальніше
                  <ArrowRight size={14} />
                </div>
              </Link>
            </HighlightCard>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
            Також допоможу з
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {secondaryServices.map((service) => (
            <HighlightCard key={service.slug}>
              <Link
                href={`/${service.slug}`}
                className="glass glass-hover p-3 md:p-4 group text-center cursor-pointer min-h-[44px] block"
              >
                <div className="icon-container mb-2 mx-auto">
                  <ServiceIcon slug={service.slug} size={20} />
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors duration-200">
                  {service.shortTitle}
                </h4>
              </Link>
            </HighlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
