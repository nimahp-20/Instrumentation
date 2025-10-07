import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/utils';
import { db, dbConfig } from '@/lib/database';
import { Post } from '@/lib/database/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return createErrorResponse('Slug parameter is required', 400);
    }

    const post = await db.getPostBySlug(slug);

    if (!post) {
      return createErrorResponse('Post not found', 404);
    }

    if (post.status !== 'published') {
      return createErrorResponse('Post not found', 404);
    }

    // Increment view count
    await db.update<Post>(dbConfig.collections.posts, post.id, { viewCount: post.viewCount + 1 });

    // Get author and category details
    const author = await db.getUserById(post.authorId);
    const category = await db.getCategoryById(post.categoryId);

    // Enhanced SEO data
    const postWithSEO = {
      ...post,
      author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
      category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
      seo: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        keywords: post.metaKeywords || post.tags,
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
        ogImage: post.featuredImage,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        author: author?.name,
        section: category?.name,
        tags: post.tags,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          '@type': 'Person',
          name: author?.name,
        },
        publisher: {
          '@type': 'Organization',
          name: process.env.NEXT_PUBLIC_SITE_NAME || 'My Next.js App',
        },
      }
    };

    return createSuccessResponse(postWithSEO);

  } catch (_error) {
    return createErrorResponse('Failed to fetch post', 500);
  }
}
