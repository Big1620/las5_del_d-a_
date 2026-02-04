/**
 * Etiqueta de categoría - estilo pill rojo
 * Fondo #E4002B, texto blanco, mayúsculas, bold, padding 4px 12px, border-radius 2px, 11-12px
 * Hover: fondo #C50025, transition 0.2s ease
 */

import Link from 'next/link';
import { getCategoryDisplayName, getCategoryHref } from '@/lib/utils';
import type { Category } from '@/types';

export interface CategoryLabelProps {
  category: Category;
  className?: string;
}

export function CategoryLabel({ category, className = '' }: CategoryLabelProps) {
  return (
    <Link
      href={getCategoryHref(category)}
      className={`
        inline-block bg-category text-white font-bold uppercase tracking-wide
        py-1 px-3 rounded-sm text-[11px] sm:text-xs
        hover:bg-hover-red transition-colors duration-200
        ${className}
      `.trim()}
    >
      {getCategoryDisplayName(category)}
    </Link>
  );
}
