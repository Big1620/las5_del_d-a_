/**
 * TrendingSidebar Component
 * Displays trending articles in sidebar
 */

import type { NewsArticle } from '@/types';
import { ArticleCard } from './article-card';
import { Separator } from '@/components/ui/separator';

export interface TrendingSidebarProps {
  articles: NewsArticle[];
  title?: string;
}

export function TrendingSidebar({ articles, title = 'Tendencias' }: TrendingSidebarProps) {
  if (articles.length === 0) return null;

  return (
    <aside className="space-y-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={article.id}>
            <ArticleCard article={article} variant="compact" showExcerpt={false} />
            {index < articles.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
