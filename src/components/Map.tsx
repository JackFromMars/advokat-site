import { contacts } from "@/data/contacts";

export default function Map() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Як <span className="gold-gradient">знайти</span>
          </h2>
          <a
            href={contacts.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            {contacts.address}
          </a>
        </div>

        <div className="glass p-2 overflow-hidden">
          <iframe
            src={contacts.googleMapsEmbed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Офіс адвоката на карті"
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
