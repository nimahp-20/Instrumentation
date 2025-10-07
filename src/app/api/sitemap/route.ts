import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/utils';
import { db } from '@/lib/database';
import { Category } from '@/lib/database/models';

export async function GET(_request: NextRequest) {
  try {
    const settings = await db.getSiteSettings();
    const posts = await db.getPublishedPosts();
    const categories = await db.findAll<Category>('categories');

    // Generate sitemap data
    const sitemap = {
      site: {
        url: settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        lastModified: new Date().toISOString(),
      },
      pages: [
        {
          url: '/',
          priority: 1.0,
          changeFrequency: 'daily',
          lastModified: new Date().toISOString(),
        },
        {
          url: '/about',
          priority: 0.8,
          changeFrequency: 'monthly',
          lastModified: new Date().toISOString(),
        },
        {
          url: '/contact',
          priority: 0.7,
          changeFrequency: 'monthly',
          lastModified: new Date().toISOString(),
        },
      ],
      posts: posts.map(post => ({
        url: `/posts/${post.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly',
        lastModified: post.updatedAt,
        publishedAt: post.publishedAt,
      })),
      categories: categories.map(category => ({
        url: `/categories/${category.slug}`,
        priority: 0.8,
        changeFrequency: 'weekly',
        lastModified: category.updatedAt,
      })),
    };

    return createSuccessResponse(sitemap);

  } catch (_error) {
    return createErrorResponse('Failed to generate sitemap', 500);
  }
}
