import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import WorkStages from "@/components/WorkStages";
import Certificates from "@/components/Certificates";
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
      <WorkStages />
      <Certificates />
      <Reviews data={reviews} />
      <FAQ items={generalFAQ} />
      <Map />
      <section id="contacts" className="section-glow py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="eyebrow mb-4">Зворотний зв&apos;язок</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Зв&apos;яжіться{" "}
              <span className="gold-gradient">зі мною</span>
            </h2>
          </div>
          <ContactForm variant="section" />
        </div>
      </section>
    </>
  );
}
