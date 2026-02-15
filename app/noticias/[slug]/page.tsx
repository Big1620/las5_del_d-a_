/**
 * Article page: /noticias/[slug]
 * ISR, generateStaticParams, dynamic metadata, JSON-LD, AdSlot (dynamic import para reducir JS).
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getPostBySlug, getPostSlugs } from '@/lib/api/wordpress';
import { generateArticleMetadata } from '@/lib/seo/metadata';
import { generateNewsArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { getArticleUrl, getCategoryDisplayName, getCategoryHref, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

const AdSlot = dynamic(
  () => import('@/components/ads/ad-slot').then((m) => ({ default: m.AdSlot })),
  {
    ssr: false,
    loading: () => <div className="my-8 min-h-[250px] bg-bg-ad dark:bg-gray-800 animate-pulse rounded" aria-hidden />,
  }
);

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPostSlugs(50);
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === '__build_fallback') notFound();
  const article = await getPostBySlug(slug);
  if (!article) notFound();
  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  if (slug === '__build_fallback') notFound();
  const article = await getPostBySlug(slug);
  if (!article) notFound();

  const schema = generateNewsArticleSchema(article);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    ...article.categories.slice(0, 1).map((c) => ({
      name: getCategoryDisplayName(c),
      url: getCategoryHref(c),
    })),
    { name: article.title, url: getArticleUrl(article.slug) },
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
          {article.categories[0] && (
            <>
              <span className="mx-2">/</span>
              <Link href={getCategoryHref(article.categories[0])} className="hover:text-foreground">
                {getCategoryDisplayName(article.categories[0])}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <header className="mb-6">
              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={getCategoryHref(c)}
                      className="text-sm font-medium text-category hover:text-hover-red hover:underline"
                    >
                      {getCategoryDisplayName(c)}
                    </Link>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{article.author.name}</span>
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                {article.modified !== article.date && (
                  <span>Actualizado: {formatDate(article.modified)}</span>
                )}
              </div>
            </header>

            {article.featuredImage && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8">
                <Image
                  src={article.featuredImage.url}
                  alt={article.featuredImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALnT9RvbO0igt7ueKKNQqIkhCqB0AKKKKk2bMZJj/9k="
                />
              </div>
            )}

            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <AdSlot
              adSlotId="1234567890"
              format="rectangle"
              size="300x250"
              minHeight={250}
              lazy
              className="my-8"
            />

            {article.tags.length > 0 && (
              <footer className="mt-8 pt-6 border-t">
                <span className="text-sm text-muted-foreground mr-2">Etiquetas:</span>
                {article.tags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/etiqueta/${t.slug}`}
                    className="inline-block text-sm bg-muted px-2 py-1 rounded mr-2 mb-2 hover:bg-muted/80"
                  >
                    {t.name}
                  </Link>
                ))}
              </footer>
            )}
          </article>

          <aside className="lg:col-span-4 space-y-8">
            <AdSlot
              adSlotId="0987654321"
              format="vertical"
              size="300x600"
              minHeight={600}
              lazy
            />
          </aside>
        </div>
      </div>
    </>
  );
}
