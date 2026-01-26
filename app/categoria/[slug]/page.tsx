/**
 * Category archive: /categoria/[slug]
 * ISR, generateStaticParams, dynamic metadata, JSON-LD, AdSlot.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getCategoryBySlug,
  getCategorySlugs,
  getPosts,
} from '@/lib/api/wordpress';
import { generateCategoryMetadata } from '@/lib/seo/metadata';
import {
  generateCategorySchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { getArticleUrl, getCategoryUrl, absolute } from '@/lib/utils';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/ads/ad-slot';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCategorySlugs(50);
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  return generateCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts: categoryPosts } = await getPosts(1, 24, category.id);
  const articleUrls = categoryPosts.map((p) => absolute(getArticleUrl(p.slug)));

  const schema = generateCategorySchema(category, articleUrls);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: category.name, url: getCategoryUrl(category.slug) },
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
          <span className="text-foreground">{category.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground max-w-2xl">{category.description}</p>
          )}
          {category.count != null && (
            <p className="text-sm text-muted-foreground mt-2">
              {category.count} {category.count === 1 ? 'artículo' : 'artículos'}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {categoryPosts.length === 0 ? (
              <p className="text-muted-foreground">Aún no hay noticias en esta categoría.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPosts.map((article) => (
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
