import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format relative time (e.g., "hace 2 horas")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace unos momentos';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return formatDate(dateString);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate article URL from slug
 */
export function getArticleUrl(slug: string): string {
  return `/noticias/${slug}`;
}

/**
 * Generate category URL
 */
export function getCategoryUrl(slug: string): string {
  return `/categoria/${slug}`;
}

/** Slugs/nombres que WordPress usa para "sin categoría" */
const UNCATEGORIZED_SLUGS = ['uncategorized', 'sin-categoria', 'sin-categoría'];
const UNCATEGORIZED_NAMES = ['uncategorized', 'sin categoría', 'sin categoria'];

/** Cuando la categoría es "Uncategorized", se muestra este nombre y se enlaza a esta categoría */
export const UNCATEGORIZED_DISPLAY_NAME = 'Subsidios';
export const UNCATEGORIZED_FALLBACK_SLUG = 'subsidios';

/**
 * Indica si una categoría es la categoría por defecto "Sin categoría"
 */
export function isUncategorized(category: { name?: string; slug: string }): boolean {
  const slug = category.slug?.toLowerCase().trim() ?? '';
  const name = (category.name ?? '').toLowerCase().trim();
  return (
    UNCATEGORIZED_SLUGS.some((s) => s === slug) ||
    UNCATEGORIZED_NAMES.some((n) => n === name)
  );
}

/**
 * Nombre a mostrar para una categoría: "Uncategorized" → "Subsidios" (o el que definas en UNCATEGORIZED_DISPLAY_NAME)
 */
export function getCategoryDisplayName(category: { name: string; slug: string }): string {
  return isUncategorized(category) ? UNCATEGORIZED_DISPLAY_NAME : category.name;
}

/**
 * URL para una categoría: si es "Uncategorized" enlaza a /categoria/subsidios
 */
export function getCategoryHref(category: { slug: string }): string {
  return isUncategorized(category) ? getCategoryUrl(UNCATEGORIZED_FALLBACK_SLUG) : getCategoryUrl(category.slug);
}

/**
 * Generate tag URL
 */
export function getTagUrl(slug: string): string {
  return `/etiqueta/${slug}`;
}

/**
 * Generate author URL
 */
export function getAuthorUrl(slug: string): string {
  return `/autor/${slug}`;
}

const FALLBACK_SITE_URL = 'https://example.com';

/**
 * Absolute URL for canonical, OG, sitemap. Uses NEXT_PUBLIC_SITE_URL.
 */
export function absolute(path: string): string {
  const base = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) || FALLBACK_SITE_URL;
  const normalized = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${normalized}${p}`;
}
