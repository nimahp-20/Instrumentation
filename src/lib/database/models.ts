// Database Configuration
export const dbConfig = {
  // For development, we'll use a simple JSON file approach
  // In production, you would use a real database like PostgreSQL, MongoDB, etc.
  dataDir: process.env.DATA_DIR || './data',
  collections: {
    users: 'users.json',
    posts: 'posts.json',
    categories: 'categories.json',
    settings: 'settings.json',
  }
};

// Database Models
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  viewCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string[];
    ogImage?: string;
    twitterCard?: string;
  };
  analytics: {
    googleAnalytics?: string;
    googleTagManager?: string;
  };
  updatedAt: string;
}
