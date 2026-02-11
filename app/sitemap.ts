/**
 * Sitemap XML generator (Next.js MetadataRoute)
 *
 * Incluye:
 * - Páginas estáticas: home, buscar, contacto, sobre-nosotros, privacidad, términos
 * - Noticias (posts): /noticias/[slug]
 * - Categorías: /categoria/[slug]
 * - Etiquetas: /etiqueta/[slug]
 * - Autores: /autor/[slug]
 *
 * Prioridades y changeFrequency pensadas para SEO y crawling eficiente.
 */

import type { MetadataRoute } from 'next';
import { getPosts, getCategories, getTags, getAuthorSlugs } from '@/lib/api/wordpress';
import { getArticleUrl, getCategoryUrl, getTagUrl, getAuthorUrl } from '@/lib/utils';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lascincodeldia.com').replace(/\/$/, '');

/** Páginas estáticas del sitio con prioridad y frecuencia de cambio */
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '', changeFrequency: 'hourly', priority: 1 },
  { path: '/buscar', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contacto', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/sobre-nosotros', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.3 },
];

function buildStaticSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path || '/'}`.replace(/\/\/$/, '/'),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = buildStaticSitemap();

  let postEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];
  let tagEntries: MetadataRoute.Sitemap = [];
  let authorEntries: MetadataRoute.Sitemap = [];

  try {
    const [postsData, categories, tags, authorSlugs] = await Promise.all([
      getPosts(1, 500),
      getCategories(),
      getTags(),
      getAuthorSlugs(100),
    ]);

    postEntries = postsData.posts.map((post) => ({
      url: `${SITE_URL}${getArticleUrl(post.slug)}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    categoryEntries = categories.map((cat) => ({
      url: `${SITE_URL}${getCategoryUrl(cat.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    }));

    tagEntries = tags.map((tag) => ({
      url: `${SITE_URL}${getTagUrl(tag.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    authorEntries = authorSlugs.map(({ slug }) => ({
      url: `${SITE_URL}${getAuthorUrl(slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
  } catch (err) {
    console.warn('[sitemap] Error fetching WordPress data, using static entries only:', err);
  }

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
    ...authorEntries,
  ];
}
