/**
 * Structured Data (JSON-LD) for SEO
 * NewsArticle, BreadcrumbList, CollectionPage. Canonical URLs from SITE_URL.
 */

import type { NewsArticle, Author, Category } from '@/types';
import { getArticleUrl, getCategoryUrl, absolute } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las 5 del Día';

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
    articleSection: article.categories.map((c) => c.name).join(', ') || undefined,
    keywords: article.tags.length ? article.tags.map((t) => t.name).join(', ') : undefined,
  };
}

/**
 * Generate CollectionPage / ItemList schema for category archive.
 */
export function generateCategorySchema(category: Category, articleUrls: string[]): object {
  const pageUrl = absolute(getCategoryUrl(category.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `Noticias sobre ${category.name}`,
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
 * Generate Organization schema
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add social media URLs here
    ],
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
