/**
 * Author archive: /autor/[slug]
 * ISR, generateStaticParams, dynamic metadata, JSON-LD, AdSlot.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAuthorBySlug,
  getAuthorSlugs,
  getPosts,
} from '@/lib/api/wordpress';
import { generateAuthorMetadata } from '@/lib/seo/metadata';
import {
  generateAuthorSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { getArticleUrl, getAuthorUrl, absolute } from '@/lib/utils';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/ads/ad-slot';
import type { Metadata } from 'next';

// Revalidate every 2 minutes for author pages
export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs(50);
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();
  return generateAuthorMetadata(author);
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const { posts: authorPosts } = await getPosts(1, 24, undefined, undefined, undefined, author.id);
  const articleUrls = authorPosts.map((p) => absolute(getArticleUrl(p.slug)));

  const schema = generateAuthorSchema(author, articleUrls);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: author.name, url: getAuthorUrl(author.slug) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="container mx-auto px-4 py-8">
        <nav aria-label="Migas de pan" className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{author.name}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-start gap-6">
            {author.avatar && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{author.name}</h1>
              {author.description && (
                <p className="text-muted-foreground max-w-2xl mb-2">{author.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {authorPosts.length} {authorPosts.length === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {authorPosts.length === 0 ? (
              <p className="text-muted-foreground">Este autor aún no ha publicado artículos.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorPosts.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            )}

            <AdSlot
              adSlotId="1234567890"
              format="horizontal"
              size="728x90"
              minHeight={90}
              lazy
              testMode
            />
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <AdSlot
              adSlotId="0987654321"
              format="vertical"
              size="300x600"
              minHeight={600}
              lazy
              testMode
            />
          </aside>
        </div>
      </div>
    </>
  );
}
