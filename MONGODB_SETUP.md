# MongoDB Setup Guide

## Quick Setup

1. **Create the database in MongoDB Compass:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Create a new database named `tools`

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Update the `MONGODB_URI` if needed

3. **Run the database setup:**
   ```bash
   npm run setup-db
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Structure

The `tools` database will contain these collections:

- **users** - User accounts and profiles
- **posts** - Blog posts and articles
- **categories** - Post categories
- **sitesettings** - Site configuration

## Sample Data

The setup script will create:
- 1 admin user (admin@example.com)
- 2 sample categories (Technology, Web Development)
- 2 sample posts
- Site settings

## API Endpoints

Once set up, you can test these endpoints:

- `GET /api/health` - Health check
- `GET /api/posts` - Get all published posts
- `GET /api/posts/[slug]` - Get specific post
- `GET /api/categories` - Get all categories
- `GET /api/search?q=query` - Search content
- `GET /api/sitemap` - Generate sitemap data
- `GET /api/metadata?url=/posts/slug` - Get SEO metadata

## Troubleshooting

If you encounter connection issues:

1. **Check MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check in MongoDB Compass
   ```

2. **Verify connection string:**
   - Default: `mongodb://localhost:27017/tools`
   - Make sure port 27017 is not blocked

3. **Check database exists:**
   - Open MongoDB Compass
   - Verify `tools` database exists

4. **Reset database:**
   ```bash
   # Delete and recreate the database in MongoDB Compass
   npm run setup-db
   ```
