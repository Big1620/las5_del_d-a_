/**
 * GET /api/archive-posts – paginated posts for category, tag or author.
 * Used by infinite scroll. Respects ISR via getPostsWithPagination cache.
 */

import { NextRequest } from 'next/server';
import { getPostsWithPagination } from '@/lib/api/wordpress';

const PER_PAGE_MAX = 24;
const PER_PAGE_DEFAULT = 12;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const perPage = Math.min(
    PER_PAGE_MAX,
    Math.max(1, parseInt(searchParams.get('perPage') ?? String(PER_PAGE_DEFAULT), 10) || PER_PAGE_DEFAULT)
  );
  const categoryId = searchParams.get('categoryId')
    ? parseInt(searchParams.get('categoryId')!, 10)
    : undefined;
  const tagId = searchParams.get('tagId')
    ? parseInt(searchParams.get('tagId')!, 10)
    : undefined;
  const authorId = searchParams.get('authorId')
    ? parseInt(searchParams.get('authorId')!, 10)
    : undefined;

  if (!categoryId && !tagId && !authorId) {
    return Response.json(
      { error: 'One of categoryId, tagId or authorId is required' },
      { status: 400 }
    );
  }

  const filters = {
    ...(categoryId && { category: categoryId }),
    ...(tagId && { tag: tagId }),
    ...(authorId && { author: authorId }),
  };

  const { posts, total, totalPages } = await getPostsWithPagination(
    page,
    perPage,
    filters
  );

  return Response.json({ posts, total, totalPages });
}
