# API Documentation

## Overview
This Next.js application provides a comprehensive REST API for managing content with SEO optimization in mind.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string,
  "timestamp": string
}
```

## Endpoints

### Health Check
**GET** `/api/health`
- **Description**: Check API health status
- **Authentication**: Not required
- **Response**: System status and version info

### Posts

#### Get All Posts
**GET** `/api/posts`
- **Description**: Retrieve published posts with pagination and filtering
- **Authentication**: Not required
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10, max: 100)
  - `sort` (string): Sort field (default: 'createdAt')
  - `order` (string): Sort order 'asc' or 'desc' (default: 'desc')
  - `category` (string): Filter by category ID
  - `tag` (string): Filter by tag
  - `search` (string): Search in title, excerpt, and content

#### Get Post by Slug
**GET** `/api/posts/[slug]`
- **Description**: Retrieve a specific post by its slug
- **Authentication**: Not required
- **Response**: Post details with SEO metadata and structured data

#### Create Post
**POST** `/api/posts`
- **Description**: Create a new post
- **Authentication**: Required
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "excerpt": "string",
    "authorId": "string",
    "categoryId": "string",
    "tags": ["string"],
    "status": "draft|published|archived",
    "featuredImage": "string",
    "seoTitle": "string",
    "seoDescription": "string",
    "metaKeywords": ["string"]
  }
  ```

### Categories

#### Get All Categories
**GET** `/api/categories`
- **Description**: Retrieve all categories
- **Authentication**: Not required
- **Response**: Categories with SEO metadata

#### Create Category
**POST** `/api/categories`
- **Description**: Create a new category
- **Authentication**: Required
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "parentId": "string",
    "seoTitle": "string",
    "seoDescription": "string"
  }
  ```

### SEO Endpoints

#### Get Sitemap Data
**GET** `/api/sitemap`
- **Description**: Generate sitemap data for SEO
- **Authentication**: Not required
- **Response**: Structured sitemap data with priorities and change frequencies

#### Get Page Metadata
**GET** `/api/metadata`
- **Description**: Get SEO metadata for a specific URL
- **Authentication**: Not required
- **Query Parameters**:
  - `url` (string): The URL to get metadata for
- **Response**: SEO metadata including Open Graph and Twitter Card data

#### Search Content
**GET** `/api/search`
- **Description**: Search posts and categories
- **Authentication**: Not required
- **Query Parameters**:
  - `q` (string): Search query (minimum 2 characters)
- **Response**: Search results with relevance scoring

## Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Resource already exists
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info included in response headers

## SEO Features
- Automatic slug generation from titles
- Meta tags and Open Graph support
- Structured data (JSON-LD) for articles
- Sitemap generation
- Search functionality
- Canonical URLs
- Social media optimization

## Database
The API uses a file-based database for development. In production, replace with:
- PostgreSQL
- MongoDB
- MySQL
- Or any other database of choice

## Environment Variables
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Next.js App
DATA_DIR=./data
NODE_ENV=development
```
