/**
 * Home Page
 * Main landing page with featured articles, breaking news, and latest posts
 * 
 * Design decisions:
 * - ISR with revalidation for fast updates
 * - Newspaper-style grid layout
 * - Mobile-first responsive design
 * - Ad slots integrated without CLS
 * - SEO optimized with structured data
 */

import { Suspense } from 'react';
import { getHomePageData } from '@/lib/api/wordpress';
import { generateNewsArticleSchema } from '@/lib/seo/structured-data';
import { ArticleCard } from '@/components/news/article-card';
import { BreakingNews } from '@/components/news/breaking-news';
import { TrendingSidebar } from '@/components/news/trending-sidebar';
import { AdSlot } from '@/components/ads/ad-slot';

// Revalidate every 60 seconds for breaking news
export const revalidate = 60;

async function HomePageContent() {
  // Fetch homepage data
  // In production, this would fetch from WordPress API
  // For now, using mock data structure
  const data = await getHomePageData();

  return (
    <>
      {/* Breaking News Banner */}
      {data.breaking.length > 0 && (
        <BreakingNews articles={data.breaking} />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Articles Section */}
            {data.featured.length > 0 && (
              <section>
                <h1 className="text-3xl font-bold mb-6">Destacadas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.featured.slice(0, 2).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="featured"
                    />
                  ))}
                </div>
                {data.featured.length > 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {data.featured.slice(2, 5).map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="default"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Ad Slot - Horizontal */}
            <AdSlot
              adSlotId="1234567890"
              format="horizontal"
              size="728x90"
              minHeight={90}
              lazy
              testMode
            />

            {/* Latest Articles Section */}
            {data.latest.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Últimas Noticias</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.latest.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Ad Slot - Rectangle */}
            <AdSlot
              adSlotId="0987654321"
              format="rectangle"
              size="300x250"
              minHeight={250}
              lazy
              testMode
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Trending Sidebar */}
            {data.trending.length > 0 && (
              <TrendingSidebar articles={data.trending} />
            )}

            {/* Ad Slot - Vertical */}
            <AdSlot
              adSlotId="1122334455"
              format="vertical"
              size="300x600"
              minHeight={600}
              lazy
              testMode
            />

            {/* Newsletter placeholder */}
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-bold mb-2">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recibe las últimas noticias en tu correo.
              </p>
              {/* Newsletter form would go here */}
            </div>
          </aside>
        </div>
      </div>

      {/* Structured Data for featured articles */}
      {data.featured.length > 0 && (
        <>
          {data.featured.slice(0, 3).map((article) => (
            <script
              key={article.id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateNewsArticleSchema(article)),
              }}
            />
          ))}
        </>
      )}
    </>
  );
}

// Loading fallback
function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="h-64 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </aside>
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
