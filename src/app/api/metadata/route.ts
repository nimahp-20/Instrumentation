import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/utils';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return createErrorResponse('URL parameter is required', 400);
    }

    const settings = await db.getSiteSettings();
    let metadata = null;

    // Try to find metadata for the URL
    if (url.includes('/posts/')) {
      const slug = url.split('/posts/')[1];
      const post = await db.getPostBySlug(slug);
      if (post) {
        metadata = {
          title: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          keywords: post.metaKeywords || post.tags,
          image: post.featuredImage,
          type: 'article',
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
        };
      }
    } else if (url.includes('/categories/')) {
      const slug = url.split('/categories/')[1];
      const category = await db.getCategoryBySlug(slug);
      if (category) {
        metadata = {
          title: category.seoTitle || category.name,
          description: category.seoDescription || category.description,
          type: 'website',
        };
      }
    }

    // Fallback to site settings
    if (!metadata && settings) {
      metadata = {
        title: settings.seo.defaultTitle,
        description: settings.seo.defaultDescription,
        keywords: settings.seo.defaultKeywords,
        image: settings.seo.ogImage,
        type: 'website',
      };
    }

    // Default fallback
    if (!metadata) {
      metadata = {
        title: 'My Next.js App',
        description: 'A modern Next.js application',
        keywords: ['nextjs', 'react', 'typescript'],
        type: 'website',
      };
    }

    return createSuccessResponse({
      url,
      metadata: {
        ...metadata,
        siteName: settings?.siteName || 'My Next.js App',
        siteUrl: settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        locale: 'en_US',
        twitterCard: settings?.seo.twitterCard || 'summary_large_image',
      }
    });

  } catch (_error) {
    return createErrorResponse('Failed to fetch metadata', 500);
  }
}
