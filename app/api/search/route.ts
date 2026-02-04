/**
 * Search API route
 * Handles search requests and returns posts from WordPress
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/api/wordpress';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json({ posts: [], total: 0 });
  }

  try {
    const { posts } = await getPosts(1, 50, undefined, undefined, query.trim());
    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda' },
      { status: 500 }
    );
  }
}
