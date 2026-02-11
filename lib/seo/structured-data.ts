/**
 * Structured Data (JSON-LD) for SEO
 * NewsArticle, BreadcrumbList, CollectionPage. Canonical URLs from SITE_URL.
 */

import type { NewsArticle, Author, Category, Tag } from '@/types';
import { getArticleUrl, getCategoryUrl, getCategoryDisplayName, getCategoryHref, getAuthorUrl, getTagUrl, absolute } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lascincodeldia.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

/**
 * Generate NewsArticle structured data. Canonical /noticias/[slug].
 */
export function generateNewsArticleSchema(article: NewsArticle): object {
  const articleUrl = absolute(getArticleUrl(article.slug));
  const desc = article.excerpt.replace(/<[^>]*>/g, '').trim();
  const images = article.featuredImage
    ? [
        article.featuredImage.url,
        ...(article.featuredImage.sizes
          ? [article.featuredImage.sizes.large, article.featuredImage.sizes.medium].filter(Boolean)
          : []),
      ]
    : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: desc || article.title,
    image: images,
    datePublished: article.date,
    dateModified: article.modified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url || absolute(`/autor/${article.author.slug}`),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    articleSection: article.categories.map((c) => getCategoryDisplayName(c)).join(', ') || undefined,
    keywords: article.tags.length ? article.tags.map((t) => t.name).join(', ') : undefined,
  };
}

/**
 * Generate CollectionPage / ItemList schema for category archive.
 */
export function generateCategorySchema(category: Category, articleUrls: string[]): object {
  const displayName = getCategoryDisplayName(category);
  const pageUrl = absolute(getCategoryHref(category));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: displayName,
    description: category.description || `Noticias sobre ${displayName}`,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articleUrls.slice(0, 10).map((url, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url,
      })),
    },
  };
}

/** URLs oficiales de redes sociales (Organization sameAs) */
const SOCIAL_LINKS = [
  'https://www.facebook.com/people/Las-5-del-d%C3%ADa/100079698616627/',
  'https://x.com/Las5_deldia',
  'https://www.instagram.com/las5_deldia/',
  'https://www.tiktok.com/@las5deldiaaaaa',
] as const;

/**
 * Generate Organization schema with social profiles (sameAs).
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [...SOCIAL_LINKS],
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Person schema for author (JSON-LD).
 */
export function generateAuthorPersonSchema(author: Author): object {
  const pageUrl = absolute(getAuthorUrl(author.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.description,
    image: author.avatar,
    url: author.url || pageUrl,
  };
}

/**
 * Generate CollectionPage + ItemList schema for author archive.
 */
export function generateAuthorSchema(author: Author, articleUrls: string[]): object {
  const pageUrl = absolute(getAuthorUrl(author.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: author.name,
    description: author.description || `Artículos escritos por ${author.name}`,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articleUrls.slice(0, 10).map((url, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url,
      })),
    },
  };
}

/**
 * Generate CollectionPage + ItemList schema for tag archive.
 */
export function generateTagSchema(tag: Tag, articleUrls: string[]): object {
  const pageUrl = absolute(getTagUrl(tag.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: tag.name,
    description: `Artículos etiquetados con ${tag.name}`,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articleUrls.slice(0, 10).map((url, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url,
      })),
    },
  };
}

/**
 * Generate BreadcrumbList schema. Use absolute URLs.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absolute(item.url),
    })),
  };
}
