/**
 * Author archive: /autor/[slug]
 * ISR revalidate=60, generateStaticParams, dynamic metadata, JSON-LD, AdSlot (dynamic) lazy.
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  getAuthorBySlug,
  getAuthorSlugs,
  getPostsWithPagination,
} from '@/lib/api/wordpress';
import { generateAuthorMetadata } from '@/lib/seo/metadata';
import {
  generateAuthorPersonSchema,
  generateAuthorSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { getArticleUrl, getAuthorUrl, absolute } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ArchiveFeed } from '@/components/news/archive-feed';
import type { Metadata } from 'next';

const AdSlot = dynamic(
  () => import('@/components/ads/ad-slot').then((m) => ({ default: m.AdSlot })),
  {
    ssr: false,
    loading: () => <div className="min-h-[90px] lg:min-h-[600px] bg-bg-ad dark:bg-gray-800 animate-pulse rounded" aria-hidden />,
  }
);

const PER_PAGE = 12;
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

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

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(String(pageParam || '1'), 10) || 1);

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const { posts: authorPosts, totalPages, total } = await getPostsWithPagination(
    currentPage,
    PER_PAGE,
    { author: author.id }
  );
  const articleUrls = authorPosts.map((p) => absolute(getArticleUrl(p.slug)));

  const personSchema = generateAuthorPersonSchema(author);
  const collectionSchema = generateAuthorSchema(author, articleUrls);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: author.name, url: getAuthorUrl(author.slug) },
  ]);

  const basePath = getAuthorUrl(author.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: author.name },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <div className="flex items-start gap-6">
            {author.avatar && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={96}
                  height={96}
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
                {total} {total === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {authorPosts.length === 0 && total === 0 ? (
              <p className="text-muted-foreground">Este autor aún no ha publicado artículos.</p>
            ) : (
              <ArchiveFeed
                initialPosts={authorPosts}
                totalPages={totalPages}
                total={total}
                filter={{ authorId: author.id }}
                basePath={basePath}
                perPage={PER_PAGE}
                initialPage={currentPage}
              />
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

          <aside className="lg:col-span-4 space-y-8 sticky top-8 self-start transition-all duration-300">
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
