import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/utils';
import { db } from '@/lib/database';
import { Category } from '@/lib/database/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return createErrorResponse('Search query must be at least 2 characters', 400);
    }

    const posts = await db.getPublishedPosts();
    const categories = await db.findAll<Category>('categories');

    const searchResults = {
      posts: posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.categoryId,
        tags: post.tags,
        publishedAt: post.publishedAt,
        url: `/posts/${post.slug}`,
      })),
      categories: categories.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.description.toLowerCase().includes(query.toLowerCase())
      ).map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        url: `/categories/${category.slug}`,
      })),
    };

    return createSuccessResponse({
      query,
      results: searchResults,
      totalResults: searchResults.posts.length + searchResults.categories.length,
    });

  } catch (_error) {
    return createErrorResponse('Search failed', 500);
  }
}
