import type { Service } from "@/data/services";
import type { FAQItem } from "@/data/faq";
import Breadcrumbs from "./Breadcrumbs";
import FAQ from "./FAQ";
import ContactForm from "./ContactForm";
import ServiceIcon from "@/components/icons/ServiceIcons";

interface ServicePageContentProps {
  service: Service;
}

export default function ServicePageContent({
  service,
}: ServicePageContentProps) {
  return (
    <>
      <section className="section-bg pt-6 sm:pt-8 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: service.title }]} />

          <div className="mt-6 sm:mt-8 mb-8 sm:mb-12">
            <div className="icon-container-lg mb-4 sm:mb-6">
              <ServiceIcon slug={service.slug} size={28} />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-[var(--color-muted)] max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {service.subServices.map((sub) => (
              <div key={sub.title} className="glass glass-hover p-4 sm:p-6">
                <h2 className="font-heading text-lg font-semibold text-white mb-3">
                  {sub.title}
                </h2>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
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
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Потрібна <span className="gold-gradient">допомога</span>?
            </h2>
            <p className="text-[var(--color-muted)]">
              Залиште заявку — проконсультую безкоштовно
            </p>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
