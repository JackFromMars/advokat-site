import type { Service } from "@/data/services";
import type { FAQItem } from "@/data/faq";
import Breadcrumbs from "./Breadcrumbs";
import FAQ from "./FAQ";
import ContactForm from "./ContactForm";

interface ServicePageContentProps {
  service: Service;
}

export default function ServicePageContent({
  service,
}: ServicePageContentProps) {
  return (
    <>
      <section className="pt-8 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: service.title }]} />

          <div className="mt-8 mb-12">
            <div className="text-5xl mb-6">{service.icon}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.subServices.map((sub) => (
              <div key={sub.title} className="glass glass-hover p-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  {sub.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.faq.length > 0 && (
        <FAQ items={service.faq as FAQItem[]} title="Часті питання" />
      )}

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Потрібна <span className="gold-gradient">допомога</span>?
            </h2>
            <p className="text-slate-400">
              Залиште заявку — проконсультую безкоштовно
            </p>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
