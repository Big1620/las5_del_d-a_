/**
 * WordPress REST API client
 * Uses NEXT_PUBLIC_WP_API_URL, NEXT_PUBLIC_SITE_URL. Edge-ready fetch with ISR.
 */

import type {
  WordPressPost,
  WordPressMedia,
  WordPressAuthor,
  WordPressCategory,
  WordPressTag,
  WordPressPostWithEmbedded,
  WordPressEmbeddedAuthor,
  WordPressEmbeddedMedia,
  NewsArticle,
  Author,
  FeaturedImage,
  Category,
  Tag,
  PostsResponse,
  HomePageData,
  SlugParam,
} from '@/types';

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  '';
const REVALIDATE_SECONDS = parseInt(process.env.REVALIDATE_TIME || '60', 10);

if (!WP_API_URL) {
  console.warn(
    'NEXT_PUBLIC_WP_API_URL is not set. The app will return empty data or throw when fetching.'
  );
}

function isWordPressConfigured(): boolean {
  return !!WP_API_URL && WP_API_URL.trim() !== '';
}

type FetchCacheOptions = { next?: { revalidate: number }; cache?: RequestCache };

/**
 * Edge-ready fetch with ISR. next.revalidate enables ISR; force-cache for CDN.
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit & FetchCacheOptions = {}
): Promise<T> {
  if (!isWordPressConfigured()) {
    throw new Error(
      'WordPress API URL is not configured. Set NEXT_PUBLIC_WP_API_URL in .env.local.'
    );
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = WP_API_URL.replace(/\/$/, '');
  const url = `${base}${normalizedEndpoint}`;

  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid WordPress API URL: ${url}`);
  }

  const { next, cache, ...init } = options;
  const controller = new AbortController();
  const timeoutMs = parseInt(process.env.WP_FETCH_TIMEOUT_MS || '30000', 10); // 30 s por defecto
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const revalidate = next?.revalidate ?? REVALIDATE_SECONDS;
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...init.headers },
      // Next.js: usar solo uno de cache o next.revalidate
      ...(revalidate > 0 ? { next: { revalidate } } : { cache: cache ?? 'force-cache' }),
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`WordPress API timeout: no respuesta en ${timeoutMs}ms (${url})`);
    }
    throw err;
  }
}

function toAuthor(a: WordPressAuthor | WordPressEmbeddedAuthor | undefined, fallbackId: number): Author {
  if (!a) {
    return { id: fallbackId, name: 'Autor desconocido', slug: '' };
  }
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    avatar: a.avatar_urls?.['96'],
    description: a.description,
    url: a.url,
  };
}

function toFeaturedImage(m: WordPressMedia | WordPressEmbeddedMedia | undefined): FeaturedImage | undefined {
  if (!m) return undefined;
  const details = 'media_details' in m ? m.media_details : (m as WordPressMedia).media_details;
  const sizes = details?.sizes as Record<string, { source_url: string }> | undefined;
  return {
    id: m.id,
    url: 'source_url' in m ? m.source_url : (m as WordPressMedia).source_url,
    alt: ('alt_text' in m ? m.alt_text : (m as WordPressMedia).alt_text) || (m.title as { rendered?: string })?.rendered || '',
    width: details?.width ?? 0,
    height: details?.height ?? 0,
    sizes: sizes
      ? {
          thumbnail: sizes.thumbnail?.source_url,
          medium: sizes.medium?.source_url,
          large: sizes.large?.source_url,
          full: 'source_url' in m ? (m as WordPressEmbeddedMedia).source_url : (m as WordPressMedia).source_url,
        }
      : undefined,
  };
}

function transformPost(
  post: WordPressPost,
  media?: WordPressMedia | WordPressEmbeddedMedia,
  author?: WordPressAuthor | WordPressEmbeddedAuthor,
  categories: Category[] = [],
  tags: Tag[] = []
): NewsArticle {
  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    date: post.date,
    modified: post.modified,
    author: toAuthor(author, post.author),
    featuredImage: toFeaturedImage(media),
    categories,
    tags,
    link: post.link,
    isBreaking: false,
    isSticky: post.sticky,
  };
}

function parseEmbeddedTerms(embedded: WordPressPostWithEmbedded['_embedded']): {
  categories: Category[];
  tags: Tag[];
} {
  const categories: Category[] = [];
  const tags: Tag[] = [];
  const raw = embedded?.['wp:term'];
  if (!Array.isArray(raw)) return { categories, tags };
  for (const arr of raw) {
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
  return { categories, tags };
}

function transformPostFromEmbedded(p: WordPressPostWithEmbedded): NewsArticle {
  const emb = p._embedded;
  const media = emb?.['wp:featuredmedia']?.[0];
  const author = emb?.author?.[0];
  const { categories, tags } = parseEmbeddedTerms(emb);
  return transformPost(p, media, author, categories, tags);
}

export async function getPosts(
  page = 1,
  perPage = 10,
  category?: number,
  tag?: number,
  search?: string,
  author?: number
): Promise<PostsResponse> {
  if (!isWordPressConfigured()) {
    return { posts: [], totalPages: 0, total: 0 };
  }

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    _embed: 'true',
  });
  if (category) params.set('categories', String(category));
  if (tag) params.set('tags', String(tag));
  if (search) params.set('search', search);
  if (author) params.set('author', String(author));

  try {
    const posts = await fetchAPI<WordPressPostWithEmbedded[]>(`/posts?${params}`);
    const transformed = posts.map((post) => transformPostFromEmbedded(post));
    const total = transformed.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    return { posts: transformed, totalPages, total };
  } catch (e) {
    console.error('Error fetching posts:', e);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

/**
 * Fetch posts with pagination metadata from X-WP-Total / X-WP-TotalPages headers.
 * Use for archive pages (author, tag, category) that need correct totalPages.
 */
export async function getPostsWithPagination(
  page = 1,
  perPage = 12,
  filters: { category?: number; tag?: number; author?: number } = {}
): Promise<{ posts: NewsArticle[]; total: number; totalPages: number }> {
  if (!isWordPressConfigured()) {
    return { posts: [], total: 0, totalPages: 0 };
  }

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    _embed: 'true',
  });
  if (filters.category) params.set('categories', String(filters.category));
  if (filters.tag) params.set('tags', String(filters.tag));
  if (filters.author) params.set('author', String(filters.author));

  const base = WP_API_URL.replace(/\/$/, '');
  const normalizedEndpoint = `/posts?${params}`;
  const resolved = `${base}${normalizedEndpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(resolved, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
    }

    const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
    const totalPages = Math.max(1, parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10));
    const data: WordPressPostWithEmbedded[] = await res.json();
    const posts = data.map((post) => transformPostFromEmbedded(post));
    return { posts, total, totalPages };
  } catch (e) {
    console.error('Error fetching posts with pagination:', e);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

/**
 * Fetch single post by slug. Uses _embed; returns null when not found (→ notFound).
 */
export async function getPostBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const posts = await fetchAPI<WordPressPostWithEmbedded[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=true`
    );
    if (!posts?.length) return null;
    return transformPostFromEmbedded(posts[0]);
  } catch (e) {
    console.error('Error fetching post by slug:', e);
    return null;
  }
}

/**
 * Slugs for generateStaticParams (ISR). Limited batch for build time.
 */
/** Slug placeholder cuando WP no responde - permite que el build estático complete */
const FALLBACK_SLUG = { slug: '__build_fallback' };

export async function getPostSlugs(limit = 100): Promise<SlugParam[]> {
  if (!isWordPressConfigured()) return [FALLBACK_SLUG];
  try {
    const list = await fetchAPI<Array<{ slug: string }>>(
      `/posts?per_page=${limit}&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    const slugs = (list || []).map((p) => ({ slug: p.slug }));
    return slugs.length > 0 ? slugs : [FALLBACK_SLUG];
  } catch (e) {
    console.error('Error fetching post slugs:', e);
    return [FALLBACK_SLUG];
  }
}

export async function getCategorySlugs(limit = 100): Promise<SlugParam[]> {
  if (!isWordPressConfigured()) return [FALLBACK_SLUG];
  try {
    const list = await fetchAPI<Array<{ slug: string }>>(
      `/categories?per_page=${limit}&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    const slugs = (list || []).map((c) => ({ slug: c.slug }));
    return slugs.length > 0 ? slugs : [FALLBACK_SLUG];
  } catch (e) {
    console.error('Error fetching category slugs:', e);
    return [FALLBACK_SLUG];
  }
}

/**
 * Home page data: 1 fetch for posts (10 items) + 1 for categories.
 * featured=slice(0,5), breaking=slice(0,3), latest=all, trending=slice(0,5).
 */
export async function getHomePageData(): Promise<HomePageData> {
  const [postsResult, categories] = await Promise.all([
    getPosts(1, 10),
    getCategories(),
  ]);
  const posts = postsResult.posts;
  return {
    featured: posts.slice(0, 5),
    breaking: posts.slice(0, 3),
    latest: posts,
    trending: posts.slice(0, 5),
    categories,
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isWordPressConfigured()) return [];
  try {
    // Categories change infrequently, use longer revalidation (5 minutes)
    const raw = await fetchAPI<WordPressCategory[]>(
      '/categories?per_page=100',
      { next: { revalidate: 300 } }
    );
    return (raw || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c.count,
      parent: c.parent,
    }));
  } catch (e) {
    console.error('Error fetching categories:', e);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const list = await fetchAPI<WordPressCategory[]>(
      `/categories?slug=${encodeURIComponent(slug)}`
    );
    if (!list?.length) return null;
    const c = list[0];
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c.count,
    };
  } catch (e) {
    console.error('Error fetching category by slug:', e);
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  if (!isWordPressConfigured()) return [];
  try {
    const raw = await fetchAPI<WordPressTag[]>('/tags?per_page=100');
    return (raw || []).map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t.count,
    }));
  } catch (e) {
    console.error('Error fetching tags:', e);
    return [];
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const list = await fetchAPI<WordPressTag[]>(
      `/tags?slug=${encodeURIComponent(slug)}`
    );
    if (!list?.length) return null;
    const t = list[0];
    return { id: t.id, name: t.name, slug: t.slug, count: t.count };
  } catch (e) {
    console.error('Error fetching tag by slug:', e);
    return null;
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const list = await fetchAPI<WordPressAuthor[]>(
      `/users?slug=${encodeURIComponent(slug)}`
    );
    if (!list?.length) return null;
    const a = list[0];
    return {
      id: a.id,
      name: a.name,
      slug: a.slug,
      avatar: a.avatar_urls?.['96'],
      description: a.description,
      url: a.url,
    };
  } catch (e) {
    console.error('Error fetching author by slug:', e);
    return null;
  }
}

export async function getTagSlugs(limit = 100): Promise<SlugParam[]> {
  if (!isWordPressConfigured()) return [FALLBACK_SLUG];
  try {
    const list = await fetchAPI<Array<{ slug: string }>>(
      `/tags?per_page=${limit}&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    const slugs = (list || []).map((t) => ({ slug: t.slug }));
    return slugs.length > 0 ? slugs : [FALLBACK_SLUG];
  } catch (e) {
    console.error('Error fetching tag slugs:', e);
    return [FALLBACK_SLUG];
  }
}

/** Si true, omite el endpoint /users (evita 401 cuando WP exige auth). */
const SKIP_AUTHORS = process.env.WP_SKIP_AUTHORS === 'true';

export async function getAuthorSlugs(limit = 100): Promise<SlugParam[]> {
  if (!isWordPressConfigured()) return [FALLBACK_SLUG];
  if (SKIP_AUTHORS) {
    console.warn('[WordPress] WP_SKIP_AUTHORS=true: omitiendo /users (evita 401)');
    return [FALLBACK_SLUG];
  }
  try {
    const list = await fetchAPI<Array<{ slug: string }>>(
      `/users?per_page=${limit}&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    const slugs = (list || []).map((a) => ({ slug: a.slug }));
    return slugs.length > 0 ? slugs : [FALLBACK_SLUG];
  } catch (e) {
    console.error('Error fetching author slugs (401 = /users requiere auth):', e);
    return [FALLBACK_SLUG];
  }
}
