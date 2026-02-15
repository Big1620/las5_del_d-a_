/**
 * Category archive: /categoria/[slug]
 * ISR, generateStaticParams, dynamic metadata, JSON-LD, infinite scroll + ?page= fallback, AdSlot (dynamic) lazy.
 */

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  getCategoryBySlug,
  getCategorySlugs,
  getPostsWithPagination,
} from '@/lib/api/wordpress';
import { generateCategoryMetadata } from '@/lib/seo/metadata';
import {
  generateCategorySchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { getArticleUrl, getCategoryDisplayName, getCategoryHref, absolute } from '@/lib/utils';
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

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCategorySlugs(50);
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === '__build_fallback') notFound();
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  return generateCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (slug === '__build_fallback') notFound();
  const currentPage = 1; // Estático: siempre página 1. Paginación vía ArchiveFeed (scroll/cliente)

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts: categoryPosts, totalPages, total } = await getPostsWithPagination(
    currentPage,
    PER_PAGE,
    { category: category.id }
  );
  const articleUrls = categoryPosts.map((p) => absolute(getArticleUrl(p.slug)));

  const schema = generateCategorySchema(category, articleUrls);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: getCategoryDisplayName(category), url: getCategoryHref(category) },
  ]);

  const basePath = getCategoryHref(category);

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
            { name: getCategoryDisplayName(category) },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{getCategoryDisplayName(category)}</h1>
          {category.description && (
            <p className="text-muted-foreground max-w-2xl">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? 'artículo' : 'artículos'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {categoryPosts.length === 0 && total === 0 ? (
              <p className="text-muted-foreground">Aún no hay noticias en esta categoría.</p>
            ) : (
              <ArchiveFeed
                initialPosts={categoryPosts}
                totalPages={totalPages}
                total={total}
                filter={{ categoryId: category.id }}
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
            />
          </div>

          <aside className="lg:col-span-4 space-y-8 sticky top-8 self-start transition-all duration-300">
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
