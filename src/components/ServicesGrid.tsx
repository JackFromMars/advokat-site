import Link from "next/link";
import { primaryServices, secondaryServices } from "@/data/services";

export default function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Основні <span className="gold-gradient">послуги</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Спеціалізуюся на найбільш затребуваних напрямках юридичної практики
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {primaryServices.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="glass glass-hover p-6 md:p-8 group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
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
                    <span className="text-amber-400/60 mt-0.5">•</span>
                    {sub.title}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Детальніше →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Також допоможу з
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {secondaryServices.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="glass glass-hover p-4 group text-center"
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                {service.shortTitle}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
