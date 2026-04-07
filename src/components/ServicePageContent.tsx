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
      {/* Hero area */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: service.title }]} />

          <div className="mt-8 md:mt-12 mb-12 md:mb-16">
            <div className="icon-container-lg mb-6">
              <ServiceIcon slug={service.slug} size={28} />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-6">
              {service.title}
            </h1>

            <p className="text-[var(--color-foreground-secondary)] text-lg max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Sub-services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {service.subServices.map((sub) => (
              <div key={sub.title} className="card-premium">
                <div className="card-premium-inner p-6 md:p-8">
                  <h2 className="font-heading text-lg md:text-xl font-semibold text-[var(--color-foreground)] mb-3">
                    {sub.title}
                  </h2>
                  <p className="text-[var(--color-foreground-secondary)] text-sm leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      {service.faq.length > 0 && (
        <FAQ items={service.faq as FAQItem[]} title="Часті питання" />
      )}

      {/* CTA section */}
      <section className="section-glow py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="eyebrow mb-4">Зворотний зв&apos;язок</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Потрібна{" "}
              <span className="gold-gradient">допомога</span>?
            </h2>
            <p className="text-[var(--color-foreground-secondary)] text-lg max-w-xl mx-auto">
              Залиште заявку — проконсультую безкоштовно
            </p>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
