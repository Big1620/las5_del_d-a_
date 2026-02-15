/**
 * Cliente WordPress para uso en navegador (fetch directo a WP REST API)
 * Usado por búsqueda y scroll infinito en sitio estático
 */

import type {
  WordPressPostWithEmbedded,
  WordPressCategory,
  WordPressTag,
  NewsArticle,
} from '@/types';

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  '';

// Copia simplificada de la transformación de wordpress.ts (compatible con cliente)
function transformPostFromEmbedded(p: WordPressPostWithEmbedded): NewsArticle {
  const emb = p._embedded;
  const media = emb?.['wp:featuredmedia']?.[0];
  const author = emb?.author?.[0];

  const rawTerms = emb?.['wp:term'];
  const categories: Array<{ id: number; name: string; slug: string; description?: string; count?: number }> = [];
  const tags: Array<{ id: number; name: string; slug: string; count?: number }> = [];
  if (Array.isArray(rawTerms)) {
    for (const arr of rawTerms) {
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        const item = t as WordPressCategory & WordPressTag;
        if (item.taxonomy === 'category') {
          categories.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: (item as WordPressCategory).description,
            count: item.count,
          });
        } else if (item.taxonomy === 'post_tag') {
          tags.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
            count: item.count,
          });
        }
      }
    }
  }

  return {
    id: p.id,
    title: p.title.rendered,
    slug: p.slug,
    excerpt: p.excerpt?.rendered || '',
    content: p.content?.rendered || '',
    date: p.date,
    modified: p.modified,
    author: author
      ? {
          id: author.id,
          name: author.name,
          slug: author.slug,
          avatar: author.avatar_urls?.['96'],
          description: author.description,
          url: author.url,
        }
      : { id: p.author, name: 'Autor desconocido', slug: '' },
    featuredImage: media
      ? {
          id: media.id,
          url: media.source_url || '',
          alt: media.alt_text || '',
          width: media.media_details?.width || 0,
          height: media.media_details?.height || 0,
          sizes: undefined,
        }
      : undefined,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c.count,
    })),
    tags: tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t.count,
    })),
    link: p.link,
    isBreaking: false,
    isSticky: p.sticky,
  };
}

function getBaseUrl(): string {
  if (!WP_API_URL?.trim()) return '';
  return WP_API_URL.replace(/\/$/, '');
}

/** Búsqueda: fetch directo a WP REST API */
export async function searchPosts(query: string): Promise<NewsArticle[]> {
  const base = getBaseUrl();
  if (!base) return [];

  const params = new URLSearchParams({
    search: query.trim(),
    per_page: '50',
    _embed: 'true',
  });
  const url = `${base}/posts?${params}`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data: WordPressPostWithEmbedded[] = await res.json();
    return (data || []).map(transformPostFromEmbedded);
  } catch {
    return [];
  }
}

/** Archive paginado: fetch directo a WP REST API (categoría, etiqueta o autor) */
export async function fetchArchivePosts(params: {
  page: number;
  perPage: number;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
}): Promise<{ posts: NewsArticle[]; total: number; totalPages: number }> {
  const base = getBaseUrl();
  if (!base) return { posts: [], total: 0, totalPages: 0 };

  const q = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
    _embed: 'true',
  });
  if (params.categoryId) q.set('categories', String(params.categoryId));
  if (params.tagId) q.set('tags', String(params.tagId));
  if (params.authorId) q.set('author', String(params.authorId));

  const url = `${base}/posts?${q}`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { posts: [], total: 0, totalPages: 0 };

    const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
    const totalPages = Math.max(1, parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10));
    const data: WordPressPostWithEmbedded[] = await res.json();
    const posts = (data || []).map(transformPostFromEmbedded);

    return { posts, total, totalPages };
  } catch {
    return { posts: [], total: 0, totalPages: 0 };
  }
}
