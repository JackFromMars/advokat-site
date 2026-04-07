import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { FAQItem } from "@/data/faq";
import { services, getServiceBySlug } from "@/data/services";
import { generateServiceSchema, generateFAQSchema } from "@/lib/schema";
import { getPlaceReviews } from "@/lib/google-places";
import ServicePageContent from "@/components/ServicePageContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
    keywords: service.keywords?.join(", "),
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      images: service.heroImage ? [{ url: service.heroImage }] : undefined,
    },
  };
}

export const revalidate = 86400; // 24 hours

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const reviews = await getPlaceReviews();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServiceSchema(service)),
        }}
      />
      {service.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(service.faq as FAQItem[])),
          }}
        />
      )}
      <ServicePageContent service={service} reviews={reviews} />
    </>
  );
}
