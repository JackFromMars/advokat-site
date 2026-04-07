import { contacts } from "@/data/contacts";

export default function Map() {
  return (
    <section id="contacts" className="section-glow py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow">Розташування</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Як нас <span className="gold-gradient">знайти</span>
          </h2>
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300 text-sm tracking-wide"
          >
            {contacts.address}
          </a>
        </div>

        {/* Map embed */}
        <div className="card-premium">
          <div className="card-premium-inner overflow-hidden">
            <iframe
              src={contacts.googleMapsEmbed}
              width="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Офіс адвоката на карті"
              className="h-[280px] sm:h-[350px] md:h-[450px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
