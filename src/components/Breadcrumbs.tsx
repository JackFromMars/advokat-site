import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] flex-wrap">
        <li>
          <Link
            href="/"
            className="cursor-pointer hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            Головна
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-[var(--color-muted)] shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                className="cursor-pointer hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--color-foreground)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
