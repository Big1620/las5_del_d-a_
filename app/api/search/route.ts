/**
 * Search API route
 * Fetch a WP search endpoint with short cache (30s)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/api/wordpress';

const SEARCH_CACHE_SECONDS = 30;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json({ posts: [], total: 0 });
  }

  try {
    const { posts } = await getPosts(1, 50, undefined, undefined, query.trim());
    const res = NextResponse.json({ posts, total: posts.length });
    res.headers.set('Cache-Control', `public, s-maxage=${SEARCH_CACHE_SECONDS}, stale-while-revalidate=${SEARCH_CACHE_SECONDS}`);
    return res;
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda' },
      { status: 500 }
    );
  }
}
