/**
 * Sitemap generator
 * Uses canonical /noticias/[slug], /categoria/[slug], /etiqueta/[slug].
 */

import { MetadataRoute } from 'next';
import { getPosts, getCategories, getTags } from '@/lib/api/wordpress';
import { getArticleUrl, getCategoryUrl, getTagUrl } from '@/lib/utils';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postsData, categories, tags] = await Promise.all([
    getPosts(1, 500),
    getCategories(),
    getTags(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/buscar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = postsData.posts.map((post) => ({
    url: `${SITE_URL}${getArticleUrl(post.slug)}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}${getCategoryUrl(cat.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}${getTagUrl(tag.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
