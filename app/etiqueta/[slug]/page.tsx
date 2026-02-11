/**
 * Tag archive: /etiqueta/[slug]
 * ISR revalidate=60, generateStaticParams, dynamic metadata (noindex if thin), JSON-LD, AdSlot (dynamic) lazy.
 */

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  getTagBySlug,
  getTagSlugs,
  getPostsWithPagination,
} from '@/lib/api/wordpress';
import { generateTagMetadata } from '@/lib/seo/metadata';
import {
  generateTagSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { getArticleUrl, getTagUrl, absolute } from '@/lib/utils';
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
  const slugs = await getTagSlugs(50);
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();
  return generateTagMetadata(tag);
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(String(pageParam || '1'), 10) || 1);

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const { posts: tagPosts, totalPages, total } = await getPostsWithPagination(
    currentPage,
    PER_PAGE,
    { tag: tag.id }
  );
  const articleUrls = tagPosts.map((p) => absolute(getArticleUrl(p.slug)));

  const schema = generateTagSchema(tag, articleUrls);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: tag.name, url: getTagUrl(tag.slug) },
  ]);

  const basePath = getTagUrl(tag.slug);

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
        <Breadcrumb
          items={[
            { name: 'Inicio', href: '/' },
            { name: tag.name },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Etiqueta: {tag.name}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? 'artículo' : 'artículos'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {tagPosts.length === 0 && total === 0 ? (
              <p className="text-muted-foreground">Aún no hay noticias con esta etiqueta.</p>
            ) : (
              <ArchiveFeed
                initialPosts={tagPosts}
                totalPages={totalPages}
                total={total}
                filter={{ tagId: tag.id }}
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
