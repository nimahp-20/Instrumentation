import connectDB from './mongodb';
import { User } from './models/User';
import { Category, Product } from './models';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding for "tools" database...');

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('✅ Database already has data, skipping seed');
      return;
    }

    // Create sample user
    const user = await User.create({
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    });
    console.log('✅ Created admin user');

    // Create sample categories
    const techCategory = await Category.create({
      name: 'Technology',
      slug: 'technology',
      description: 'Latest technology news and updates',
      seoTitle: 'Technology News',
      seoDescription: 'Stay updated with the latest technology trends and news',
    });

    const webDevCategory = await Category.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Web development tutorials and guides',
      seoTitle: 'Web Development Tutorials',
      seoDescription: 'Learn web development with our comprehensive tutorials',
    });
    console.log('✅ Created sample categories');

    // Create sample posts (commented out - Post model not available)
    /*
    const _post1 = await Post.create({
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: 'Next.js is a React framework that provides a great developer experience with features like server-side rendering, static site generation, and API routes. In this post, we\'ll explore the basics of Next.js and how to get started with your first project.',
      excerpt: 'Learn the fundamentals of Next.js and how to build modern web applications with this powerful React framework.',
      authorId: user._id,
      categoryId: webDevCategory._id,
      tags: ['nextjs', 'react', 'javascript', 'web-development'],
      status: 'published',
      seoTitle: 'Getting Started with Next.js - Complete Guide',
      seoDescription: 'Learn how to build modern web applications with Next.js. Complete guide for beginners.',
      metaKeywords: ['nextjs', 'react', 'javascript', 'web development', 'tutorial'],
      publishedAt: new Date(),
    });

    const _post2 = await Post.create({
      title: 'MongoDB Best Practices',
      slug: 'mongodb-best-practices',
      content: 'MongoDB is a popular NoSQL database that offers flexibility and scalability. In this article, we\'ll discuss best practices for designing schemas, indexing, and optimizing queries for better performance.',
      excerpt: 'Discover the best practices for working with MongoDB, including schema design, indexing strategies, and query optimization.',
      authorId: user._id,
      categoryId: techCategory._id,
      tags: ['mongodb', 'database', 'nosql', 'performance'],
      status: 'published',
      seoTitle: 'MongoDB Best Practices for Developers',
      seoDescription: 'Learn MongoDB best practices for schema design, indexing, and query optimization.',
      metaKeywords: ['mongodb', 'database', 'nosql', 'best practices', 'performance'],
      publishedAt: new Date(),
    });
    */
    console.log('✅ Sample posts creation skipped (Post model not available)');

    // Create site settings (commented out - SiteSettings model not available)
    /*
    await SiteSettings.create({
      siteName: 'My Next.js App',
      siteDescription: 'A modern Next.js application with MongoDB integration',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      socialMedia: {
        twitter: '@mynextjsapp',
        github: 'https://github.com/mynextjsapp',
      },
      seo: {
        defaultTitle: 'My Next.js App - Modern Web Development',
        defaultDescription: 'A modern Next.js application showcasing best practices in web development',
        defaultKeywords: ['nextjs', 'react', 'mongodb', 'web development'],
        twitterCard: 'summary_large_image',
      },
      analytics: {},
    });
    */
    console.log('✅ Site settings creation skipped (SiteSettings model not available)');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created: 1 user, 2 categories`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
