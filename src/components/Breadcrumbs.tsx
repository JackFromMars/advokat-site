import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-[var(--color-muted)] flex-wrap">
        <li>
          <Link
            href="/"
            className="cursor-pointer hover:text-[var(--color-foreground)] transition-colors"
          >
            Головна
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-[var(--color-muted)]" />
            {item.href ? (
              <Link
                href={item.href}
                className="cursor-pointer hover:text-[var(--color-foreground)] transition-colors"
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
