import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, parsePaginationParams } from '@/lib/api/utils';
import { db } from '@/lib/database';
import { Post } from '@/lib/database/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, sort, order } = parsePaginationParams(searchParams);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let posts = await db.getPublishedPosts();

    // Apply filters
    if (category) {
      posts = posts.filter(post => post.categoryId === category);
    }

    if (tag) {
      posts = posts.filter(post => post.tags.includes(tag));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort posts
    posts.sort((a, b) => {
      const aValue = a[sort as keyof Post];
      const bValue = b[sort as keyof Post];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    // Add SEO metadata to each post
    const postsWithSEO = paginatedPosts.map(post => ({
      ...post,
      seo: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        keywords: post.metaKeywords || post.tags,
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
        ogImage: post.featuredImage,
      }
    }));

    return createSuccessResponse({
      posts: postsWithSEO,
      pagination: {
        page,
        limit,
        total: posts.length,
      }
    });

  } catch (_error) {
    return createErrorResponse('Failed to fetch posts', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const missingFields = Object.keys(body).filter(field => 
      !body[field] || (typeof body[field] === 'string' && (body[field] as string).trim() === '')
    );

    if (missingFields.length > 0) {
      return createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingPost = await db.getPostBySlug(slug);
    if (existingPost) {
      return createErrorResponse('A post with this title already exists', 409);
    }

    const postData = {
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 160) + '...',
      authorId: body.authorId,
      categoryId: body.categoryId,
      tags: body.tags || [],
      status: body.status || 'draft',
      featuredImage: body.featuredImage,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      metaKeywords: body.metaKeywords || body.tags,
    };

    const newPost = await db.createPost(postData);

    return createSuccessResponse(newPost, 'Post created successfully', 201);

  } catch (_error) {
    return createErrorResponse('Failed to create post', 500);
  }
}
