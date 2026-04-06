import {
  Users,
  Home,
  Shield,
  Banknote,
  Plane,
  Building2,
  Wheat,
  Scale,
  type LucideProps,
} from "lucide-react";
import { type ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  "simejni-spravy": Users,
  "zhytlovi-superechky": Home,
  mobilizatsiya: Shield,
  "kredyty-ta-borhy": Banknote,
  "mihratsijne-pravo": Plane,
  "korporatyvne-pravo": Building2,
  "zemelne-ta-ahrarne-pravo": Wheat,
  "administratyvni-spravy": Scale,
};

interface ServiceIconProps extends LucideProps {
  slug: string;
}

export default function ServiceIcon({ slug, ...props }: ServiceIconProps) {
  const Icon = iconMap[slug] ?? Scale;
  return <Icon {...props} />;
}

export { iconMap };
