# Environment Configuration

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Next.js App
NEXT_PUBLIC_SITE_DESCRIPTION=A modern Next.js application with SEO optimization

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tools
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tools

# Environment
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=

# Optional: Social Media
NEXT_PUBLIC_FACEBOOK_APP_ID=
NEXT_PUBLIC_TWITTER_HANDLE=

# Optional: External Services
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## MongoDB Setup

### Local MongoDB Setup
1. Install MongoDB locally or use MongoDB Compass
2. Start MongoDB service
3. Create a database named `tools`
4. Use the connection string: `mongodb://localhost:27017/tools`

### MongoDB Atlas Setup (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the connection string
5. Add your IP address to the whitelist

## Production Environment Variables

For production deployment, update these values:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tools
```

## Database Migration

The application will automatically create the necessary collections and indexes when you first run it. No manual migration is required.

## SEO Configuration

The API automatically generates SEO-friendly URLs and metadata based on:
- Site settings from the database
- Individual post/category SEO fields
- Fallback to default values

## Security Considerations

- JWT tokens should be properly validated in production
- Rate limiting is implemented but may need adjustment
- CORS headers are set to allow all origins (restrict in production)
- Input validation should be enhanced for production use
- MongoDB connection should use authentication in production
