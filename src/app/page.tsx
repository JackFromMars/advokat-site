import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import { generalFAQ } from "@/data/faq";
import { generateFAQSchema } from "@/lib/schema";

export default function Home() {
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
      <FAQ items={generalFAQ} />
    </>
  );
}
