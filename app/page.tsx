/**
 * Página de inicio
 * Hero → Ad 728x90 → Barra secundaria → Grid 65% + Sidebar 30% (Lo más leído + Ad 300x600)
 * AdSlot y TrendingSidebar con dynamic import para reducir el bundle inicial y lazy load de anuncios.
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getHomePageData } from '@/lib/api/wordpress';
import { generateNewsArticleSchema } from '@/lib/seo/structured-data';
import { HeroArticle } from '@/components/news/hero-article';
import { SecondaryNewsBar } from '@/components/news/secondary-news-bar';
import { ColumnArticleCard } from '@/components/news/column-article-card';

const AdSlot = dynamic(
  () => import('@/components/ads/ad-slot').then((m) => ({ default: m.AdSlot })),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-bg-ad dark:bg-gray-800 w-full max-w-[728px] mx-auto animate-pulse rounded"
        style={{ minHeight: 90 }}
        aria-hidden
      />
    ),
  }
);

const TrendingSidebar = dynamic(
  () => import('@/components/news/trending-sidebar').then((m) => ({ default: m.TrendingSidebar })),
  {
    loading: () => (
      <div className="space-y-4" aria-hidden>
        <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      </div>
    ),
  }
);

export const revalidate = 60;

async function HomePageContent() {
  const data = await getHomePageData();

  const hasNoContent =
    data.featured.length === 0 &&
    data.breaking.length === 0 &&
    data.latest.length === 0 &&
    data.trending.length === 0;

  if (hasNoContent) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a {process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día'}
          </h1>
          <div className="space-y-4 text-muted-foreground">
            {!process.env.NEXT_PUBLIC_WP_API_URL && !process.env.NEXT_PUBLIC_WORDPRESS_API_URL ? (
              <>
                <p className="text-lg">WordPress no está conectado actualmente.</p>
                <p>
                  Configura <code className="px-2 py-1 bg-muted rounded text-sm">NEXT_PUBLIC_WP_API_URL</code> en{' '}
                  <code className="px-2 py-1 bg-muted rounded text-sm">.env.local</code>.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg">No hay publicaciones disponibles.</p>
                <p>Vuelve pronto para ver las últimas noticias.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const hero = data.featured[0];
  const secondaryBarArticles = data.featured.slice(1, 5);
  const combined = [...data.latest, ...data.trending];
  const withImageFirst = [...combined].sort((a, b) => (a.featuredImage ? 0 : 1) - (b.featuredImage ? 0 : 1));
  const leftColumnArticles = withImageFirst.slice(0, 4);
  const rightColumnArticles = withImageFirst.slice(4, 9);

  return (
    <>
      <div className="bg-white dark:bg-background w-full min-w-0">
        {/* Contenedor: ancho máximo 1440px, bordes rojos, responsive padding */}
        <div className="mx-auto w-full max-w-[1440px] min-w-0 border-x-0 sm:border-x-2 border-[var(--primary-red)] px-3 sm:px-4 md:px-6 pt-0 pb-4 sm:pb-6 md:pb-8">
            {/* 1. HERO - Noticia principal */}
          {hero && (
            <section>
              <HeroArticle article={hero} />
            </section>
          )}

          {/* Separador */}
          <div className="border-t border-[#E5E5E5] dark:border-gray-600 my-6 sm:my-[30px]" />

          {/* 2. Ad Slot 728x90 */}
          <div className="flex justify-center my-6 sm:my-[30px]">
            <AdSlot
              adSlotId="1234567890"
              format="horizontal"
              size="728x90"
              minHeight={90}
              lazy
              testMode
              className="bg-bg-ad dark:bg-gray-800 w-full max-w-[728px] min-w-0"
            />
          </div>

          {/* 3. BARRA SECUNDARIA - 4 noticias */}
          {secondaryBarArticles.length > 0 && (
            <section>
              <SecondaryNewsBar articles={secondaryBarArticles} />
            </section>
          )}

          {/* Separador */}
          <div className="border-t border-[#E5E5E5] dark:border-gray-600 my-6 sm:my-[30px]" />

          {/* 4. Grid principal: columna + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,320px)] gap-6 lg:gap-10 min-w-0">
            {/* Columna principal - 2 columnas en md+ */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-0 min-w-0">
              {/* Columna izquierda */}
              <div className="space-y-0 min-w-0">
                {leftColumnArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-[#E5E5E5] dark:border-gray-600 pb-8 sm:pb-10 md:pb-[50px] last:border-0 last:pb-0 mb-0"
                  >
                    <ColumnArticleCard article={article} />
                  </div>
                ))}
              </div>
              {/* Columna derecha */}
              <div className="space-y-0 min-w-0">
                {rightColumnArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-[#E5E5E5] dark:border-gray-600 pb-8 sm:pb-10 md:pb-[50px] last:border-0 last:pb-0 mb-0"
                  >
                    <ColumnArticleCard article={article} />
                  </div>
                ))}
              </div>
            </section>

            {/* Sidebar - Lo más leído + Ad */}
            <aside className="lg:sticky lg:top-28 space-y-6 lg:space-y-8 min-w-0 w-full max-w-full">
              {data.trending.length > 0 && (
                <TrendingSidebar articles={data.trending} title="Lo más leído" />
              )}
              <AdSlot
                adSlotId="1122334455"
                format="vertical"
                size="300x600"
                minHeight={250}
                lazy
                testMode
                className="bg-bg-ad dark:bg-gray-800 w-full max-w-[300px] mx-auto lg:mx-0 min-h-[250px] lg:min-h-[600px]"
              />
            </aside>
          </div>
        </div>
      </div>

      {data.featured.length > 0 &&
        data.featured.slice(0, 3).map((article) => (
          <script
            key={article.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateNewsArticleSchema(article)),
            }}
          />
        ))}
    </>
  );
}

function HomePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] min-w-0 border-x-0 sm:border-x-2 border-[var(--primary-red)] px-3 sm:px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="min-h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 lg:h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="h-64 lg:h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      </div>
      <div className="h-24 bg-bg-ad dark:bg-gray-800 animate-pulse rounded max-w-[728px] mx-auto" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-40 h-28 bg-gray-100 dark:bg-gray-800 animate-pulse rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-5 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          <div className="h-64 lg:h-96 bg-bg-ad dark:bg-gray-800 animate-pulse rounded max-w-[300px] mx-auto lg:mx-0" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
