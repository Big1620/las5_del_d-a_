/**
 * Type definitions for WordPress API responses
 * These interfaces match the WordPress REST API structure
 */

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    'version-history': Array<{ count: number; href: string }>;
    'predecessor-version': Array<{ id: number; href: string }>;
    'wp:attachment': Array<{ href: string }>;
    'wp:term': Array<{ taxonomy: string; embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    }>;
  };
  source_url: string;
  _links: Record<string, unknown>;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  _links: Record<string, unknown>;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
  _links: Record<string, unknown>;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>;
  _links: Record<string, unknown>;
}

// Transformed types for frontend use
export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  author: Author;
  featuredImage?: FeaturedImage;
  categories: Category[];
  tags: Tag[];
  link: string;
  isBreaking?: boolean;
  isSticky?: boolean;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  url?: string;
}

export interface FeaturedImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

// API Response types
export interface PostsResponse {
  posts: NewsArticle[];
  totalPages: number;
  total: number;
}

export interface HomePageData {
  featured: NewsArticle[];
  breaking: NewsArticle[];
  latest: NewsArticle[];
  trending: NewsArticle[];
  categories: Category[];
}

// WordPress _embed response shapes (REST API)
export interface WordPressEmbeddedAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: { '24': string; '48': string; '96': string };
  _links: Record<string, unknown>;
}

export interface WordPressEmbeddedMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes?: Record<string, { source_url: string; width: number; height: number }>;
  };
  title?: { rendered: string };
}

export interface WordPressPostWithEmbedded extends WordPressPost {
  _embedded?: {
    author?: WordPressEmbeddedAuthor[];
    'wp:featuredmedia'?: WordPressEmbeddedMedia[];
    'wp:term'?: [WordPressCategory[], WordPressTag[]];
  };
}

/** Slugs for generateStaticParams (ISR) */
export interface SlugParam {
  slug: string;
}
