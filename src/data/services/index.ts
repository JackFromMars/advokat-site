export interface SubService {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface WorkStage {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  metaDescription: string;
  icon: string;
  heroImage: string;
  isPrimary: boolean;
  keywords: string[];
  advantages: string[];
  stats: ServiceStat[];
  workStages: WorkStage[];
  subServices: SubService[];
  faq: ServiceFAQ[];
}

import { simejniSpravy } from "./simejni-spravy";
import { zhytloviSuperechky } from "./zhytlovi-superechky";
import { mobilizatsiya } from "./mobilizatsiya";
import { kredytyTaBorhy } from "./kredyty-ta-borhy";
import { mihratsijnePravo } from "./mihratsijne-pravo";
import { korporatyvnePravo } from "./korporatyvne-pravo";
import { zemelneTaAhrarnePravo } from "./zemelne-ta-ahrarne-pravo";
import { administratyvniSpravy } from "./administratyvni-spravy";

export const services: Service[] = [
  simejniSpravy,
  zhytloviSuperechky,
  mobilizatsiya,
  kredytyTaBorhy,
  mihratsijnePravo,
  korporatyvnePravo,
  zemelneTaAhrarnePravo,
  administratyvniSpravy,
];

export const primaryServices = services.filter((s) => s.isPrimary);
export const secondaryServices = services.filter((s) => !s.isPrimary);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
