/**
 * Shared breadcrumb navigation component.
 * Use for category, author, tag and article pages. Accessible (aria) and semantic.
 */

import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Migas de pan"
      className={`text-sm text-muted-foreground ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-x-2">
              {index > 0 && (
                <span aria-hidden className="select-none">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-foreground' : undefined}
                  {...(isLast ? { 'aria-current': 'page' as const } : {})}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
