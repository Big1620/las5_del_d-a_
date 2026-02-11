/**
 * SEO metadata utilities
 * Uses NEXT_PUBLIC_SITE_URL. Canonical + OG + Twitter per page.
 */

import type { Metadata } from 'next';
import type { NewsArticle, Author, Category, Tag } from '@/types';
import { getArticleUrl, getCategoryUrl, getCategoryDisplayName, getCategoryHref, getTagUrl, getAuthorUrl, absolute } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lascincodeldia.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/**
 * Generate base metadata for the site
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: 'Noticias de última hora, análisis y reportajes de actualidad',
    keywords: ['noticias', 'actualidad', 'periodismo', 'información'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: 'Noticias de última hora, análisis y reportajes de actualidad',
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: 'Noticias de última hora, análisis y reportajes de actualidad',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(GOOGLE_VERIFICATION && {
      verification: { google: GOOGLE_VERIFICATION },
    }),
  };
}

/**
 * Generate metadata for article page. Canonical /noticias/[slug].
 */
export function generateArticleMetadata(article: NewsArticle): Metadata {
  const articleUrl = absolute(getArticleUrl(article.slug));
  const description = article.excerpt.replace(/<[^>]*>/g, '').trim().slice(0, 160);
  const imageUrl = article.featuredImage?.url || `${SITE_URL}/og-image.jpg`;

  return {
    title: article.title,
    description: description || `Artículo: ${article.title}`,
    keywords: article.tags.length ? article.tags.map((t) => t.name) : undefined,
    authors: [{ name: article.author.name }],
    alternates: { canonical: articleUrl },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: description || undefined,
      publishedTime: article.date,
      modifiedTime: article.modified,
      authors: [article.author.name],
      images: [
        {
          url: imageUrl,
          width: article.featuredImage?.width || 1200,
          height: article.featuredImage?.height || 630,
          alt: article.featuredImage?.alt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description || undefined,
      images: [imageUrl],
    },
  };
}

/**
 * Generate metadata for category page. Canonical /categoria/[slug] o / si es "Uncategorized".
 */
export function generateCategoryMetadata(category: Category): Metadata {
  const displayName = getCategoryDisplayName(category);
  const url = absolute(getCategoryHref(category));
  const description = category.description || `Noticias sobre ${displayName}`;
  return {
    title: displayName,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: displayName,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: displayName,
      description,
    },
  };
}

/**
 * Generate metadata for tag page.
 * noindex when count is 0 or 1 to avoid thin content in index.
 */
export function generateTagMetadata(tag: Tag): Metadata {
  const url = absolute(getTagUrl(tag.slug));
  const title = `Etiqueta: ${tag.name}`;
  const description = `Artículos etiquetados con ${tag.name}`;
  const noindex = (tag.count ?? 0) <= 1;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary', title, description },
    ...(noindex && {
      robots: { index: false, follow: true },
    }),
  };
}

/**
 * Generate metadata for author page
 */
export function generateAuthorMetadata(author: Author): Metadata {
  const url = absolute(getAuthorUrl(author.slug));
  const description = author.description || `Artículos escritos por ${author.name}`;
  return {
    title: author.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'profile',
      url,
      title: author.name,
      description,
      images: author.avatar ? [author.avatar] : undefined,
    },
    twitter: { card: 'summary', title: author.name, description },
  };
}
