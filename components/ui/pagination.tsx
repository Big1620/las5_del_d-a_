/**
 * Server-side pagination links for archive pages (author, tag, category).
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  className?: string;
}

function buildPageUrl(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const separator = basePath.includes('?') ? '&' : '?';
  return `${basePath}${separator}page=${page}`;
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const showPages = 5;
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages - 1);
  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      aria-label="Paginación"
      className={cn('flex flex-wrap items-center justify-center gap-2 py-8', className)}
    >
      {prevPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildPageUrl(basePath, prevPage)} aria-label="Página anterior">
            Anterior
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled aria-label="Página anterior (no disponible)">
          Anterior
        </Button>
      )}

      <ul className="flex items-center gap-1 list-none p-0 m-0">
        {start > 1 && (
          <>
            <li>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href={buildPageUrl(basePath, 1)} aria-label="Página 1">
                  1
                </Link>
              </Button>
            </li>
            {start > 2 && <li className="px-1 text-muted-foreground">…</li>}
          </>
        )}
        {pages.map((p) => (
          <li key={p}>
            {p === currentPage ? (
              <span
                aria-current="page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium"
              >
                {p}
              </span>
            ) : (
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href={buildPageUrl(basePath, p)} aria-label={`Página ${p}`}>
                  {p}
                </Link>
              </Button>
            )}
          </li>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <li className="px-1 text-muted-foreground">…</li>
            )}
            <li>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link
                  href={buildPageUrl(basePath, totalPages)}
                  aria-label={`Página ${totalPages}`}
                >
                  {totalPages}
                </Link>
              </Button>
            </li>
          </>
        )}
      </ul>

      {nextPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildPageUrl(basePath, nextPage)} aria-label="Página siguiente">
            Siguiente
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled aria-label="Página siguiente (no disponible)">
          Siguiente
        </Button>
      )}
    </nav>
  );
}
