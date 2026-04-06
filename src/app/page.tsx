import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Map from "@/components/Map";
import ContactForm from "@/components/ContactForm";
import { generalFAQ } from "@/data/faq";
import { generateFAQSchema } from "@/lib/schema";
import { getPlaceReviews } from "@/lib/google-places";

export const revalidate = 86400; // 24 hours

export default async function Home() {
  const reviews = await getPlaceReviews();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(generalFAQ)),
        }}
      />
      <Hero />
      <Stats />
      <ServicesGrid />
      <About />
      <Reviews data={reviews} />
      <FAQ items={generalFAQ} />
      <Map />
      <section id="contacts" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Зв&#39;яжіться <span className="gold-gradient">зі мною</span>
            </h2>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
