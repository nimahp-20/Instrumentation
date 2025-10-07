# Advanced Logging System Documentation

## Overview

This advanced logging system provides comprehensive logging capabilities for your Next.js application, storing logs in MongoDB with structured data, analytics, and automated cleanup.

## Features

- ✅ **Multiple Log Levels**: debug, info, warn, error, fatal
- ✅ **Categorized Logging**: auth, api, database, security, user, system, performance, business
- ✅ **Structured Data**: Metadata, context, and tags support
- ✅ **Request Tracking**: Request ID, user ID, session tracking
- ✅ **Performance Monitoring**: Response time tracking
- ✅ **Security Logging**: IP tracking, user agent, security events
- ✅ **Database Storage**: MongoDB with optimized indexes
- ✅ **Analytics & Reporting**: Time series data, error analysis
- ✅ **Automated Cleanup**: TTL indexes and cleanup utilities
- ✅ **API Endpoints**: Query, filter, and manage logs

## Architecture

### Components

1. **Log Model** (`src/lib/models/Log.ts`)
   - MongoDB schema with indexes
   - TTL for automatic cleanup
   - Optimized for queries

2. **Logger Service** (`src/lib/logger.ts`)
   - Singleton logger instance
   - Multiple log levels and categories
   - Context and metadata support

3. **Logging Middleware** (`src/lib/middleware/logging.ts`)
   - API request/response logging
   - Performance tracking
   - Error handling

4. **Log Cleanup Service** (`src/lib/log-cleanup.ts`)
   - Automated log cleanup
   - Archiving capabilities
   - Statistics and monitoring

5. **API Endpoints**
   - `/api/logs` - Query and manage logs
   - `/api/logs/analytics` - Analytics and reporting

## Usage

### Basic Logging

```typescript
import { logger } from '@/lib/logger';

// Simple logging
await logger.info('User logged in', {
  category: 'auth',
  context: {
    userId: 'user123',
    ip: '192.168.1.1'
  }
});

// Error logging with stack trace
await logger.logError(error, 'Database connection failed', {
  category: 'database',
  context: {
    operation: 'connect',
    database: 'tools'
  }
});
```

### Convenience Methods

```typescript
import { logAuth, logApi, logSecurity, logUser } from '@/lib/logger';

// Authentication logging
await logAuth('User registration successful', {
  userId: 'user123',
  ip: '192.168.1.1',
  metadata: { email: 'user@example.com' }
});

// API logging
await logApi('API request processed', {
  requestId: 'req123',
  method: 'POST',
  url: '/api/auth/login',
  statusCode: 200,
  responseTime: 150
});

// Security logging
await logSecurity('Failed login attempt', {
  ip: '192.168.1.1',
  metadata: { email: 'user@example.com', attempts: 3 }
});

// User activity logging
await logUser('Profile updated', {
  userId: 'user123',
  metadata: { fields: ['name', 'email'] }
});
```

### Middleware Integration

```typescript
import { withApiLogging, withAuthLogging } from '@/lib/middleware/logging';

// API route with logging
export const GET = withApiLogging(async (request: NextRequest) => {
  // Your handler code
});

// Auth route with detailed logging
export const POST = withAuthLogging(async (request: NextRequest) => {
  // Your handler code
});
```

## Log Levels

| Level | Severity | Usage |
|-------|----------|-------|
| `debug` | 1 | Development debugging, detailed information |
| `info` | 2 | General information, successful operations |
| `warn` | 3 | Warning conditions, potential issues |
| `error` | 4 | Error conditions, failed operations |
| `fatal` | 5 | Critical errors, system failures |

## Log Categories

| Category | Description |
|----------|-------------|
| `auth` | Authentication and authorization events |
| `api` | API requests and responses |
| `database` | Database operations and queries |
| `security` | Security events and threats |
| `user` | User activities and actions |
| `system` | System events and maintenance |
| `performance` | Performance metrics and monitoring |
| `business` | Business logic and transactions |

## Database Schema

### Log Document Structure

```typescript
{
  level: 'info' | 'warn' | 'error' | 'fatal',
  message: string,
  category: 'auth' | 'api' | 'database' | 'security' | 'user' | 'system' | 'performance' | 'business',
  service: string,
  userId?: string,
  sessionId?: string,
  requestId?: string,
  ip?: string,
  userAgent?: string,
  method?: string,
  url?: string,
  statusCode?: number,
  responseTime?: number,
  metadata?: Record<string, any>,
  stack?: string,
  tags?: string[],
  severity: number,
  environment: string,
  version: string,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `level` - Single field index
- `category` - Single field index
- `userId` - Single field index (sparse)
- `timestamp` - Single field index with TTL (30 days)
- `level + category + timestamp` - Compound index
- `userId + timestamp` - Compound index
- `service + timestamp` - Compound index
- `severity + timestamp` - Compound index
- `environment + timestamp` - Compound index

## API Endpoints

### GET /api/logs

Query and retrieve logs with filtering and pagination.

**Query Parameters:**
- `level` - Filter by log level
- `category` - Filter by category
- `userId` - Filter by user ID
- `startDate` - Start date (ISO string)
- `endDate` - End date (ISO string)
- `limit` - Number of logs to return (default: 50)
- `offset` - Number of logs to skip (default: 0)
- `search` - Search in message and tags
- `severity` - Filter by severity level
- `environment` - Filter by environment

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [...],
    "pagination": {
      "total": 1000,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    },
    "filters": {...}
  }
}
```

### POST /api/logs?action=stats

Get log statistics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLogs": 1000,
    "errorLogs": 50,
    "logsByLevel": [...],
    "logsByCategory": [...],
    "logsByService": [...],
    "recentLogs": [...]
  }
}
```

### DELETE /api/logs

Delete old logs based on criteria.

**Query Parameters:**
- `olderThan` - Delete logs older than this date (ISO string)
- `level` - Only delete logs of this level
- `category` - Only delete logs of this category

### GET /api/logs/analytics

Get detailed analytics and time series data.

**Query Parameters:**
- `startDate` - Start date for analysis
- `endDate` - End date for analysis
- `groupBy` - Time grouping (hour, day, week, month)
- `environment` - Filter by environment

**Response:**
```json
{
  "success": true,
  "data": {
    "timeSeries": [...],
    "topErrors": [...],
    "userActivity": [...],
    "apiMetrics": [...],
    "securityEvents": [...],
    "overallStats": {...}
  }
}
```

## Log Cleanup

### Automatic Cleanup

- **TTL Index**: Logs are automatically deleted after 30 days
- **Configurable**: TTL can be adjusted in the Log model

### Manual Cleanup

```bash
# Clean up logs older than 30 days (dry run)
npm run cleanup-logs -- --dry-run --days=30

# Clean up logs older than 7 days
npm run cleanup-logs -- --days=7

# Delete error logs older than 30 days
npm run cleanup-logs -- --days=30 --delete-errors

# Delete security logs older than 30 days
npm run cleanup-logs -- --days=30 --delete-security
```

### Log Statistics

```bash
# Get log statistics
npm run log-stats
```

## Configuration

### Environment Variables

```env
# Service configuration
SERVICE_NAME=nextjs-app
APP_VERSION=1.0.0
NODE_ENV=development

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/tools
```

### Logging Options

```typescript
// Middleware options
const loggingOptions = {
  logRequestBody: false,    // Log request bodies
  logResponseBody: false,   // Log response bodies
  excludePaths: ['/api/health'], // Paths to exclude
  includeHeaders: ['content-type'], // Headers to include
  maxBodySize: 1000        // Max body size to log
};
```

## Best Practices

### 1. Log Levels
- Use `debug` for development debugging
- Use `info` for normal operations
- Use `warn` for potential issues
- Use `error` for failed operations
- Use `fatal` for critical system failures

### 2. Categories
- Use appropriate categories for better organization
- `auth` for authentication events
- `api` for API requests/responses
- `security` for security-related events
- `user` for user activities

### 3. Context and Metadata
- Include relevant context (userId, requestId, etc.)
- Use metadata for additional structured data
- Avoid logging sensitive information (passwords, tokens)

### 4. Performance
- Logging is asynchronous and won't block requests
- Use appropriate log levels to avoid noise
- Clean up old logs regularly

### 5. Security
- Don't log sensitive data (passwords, tokens, PII)
- Use security category for security events
- Monitor failed authentication attempts

## Monitoring and Alerting

### Key Metrics to Monitor

1. **Error Rate**: Percentage of error/fatal logs
2. **Response Time**: API performance metrics
3. **Security Events**: Failed logins, suspicious activity
4. **User Activity**: Active users and behavior patterns

### Alerting Thresholds

- Error rate > 5%
- Response time > 1000ms
- Security events > 10/hour
- Database errors > 5/hour

## Troubleshooting

### Common Issues

1. **High Log Volume**
   - Adjust log levels
   - Implement log sampling
   - Increase cleanup frequency

2. **Database Performance**
   - Check index usage
   - Optimize queries
   - Consider log archiving

3. **Memory Usage**
   - Monitor log buffer size
   - Implement log batching
   - Use streaming for large datasets

### Debugging

```typescript
// Enable debug logging
await logger.debug('Debug information', {
  category: 'system',
  metadata: { debugInfo: 'detailed information' }
});

// Check log statistics
const stats = await logCleanupService.getLogStats();
console.log('Log statistics:', stats);
```

## Integration Examples

### Authentication Routes

```typescript
// Registration with logging
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip = getClientIP(request);
  
  try {
    // Log registration attempt
    await logger.authLog('User registration attempt', {
      requestId,
      ip,
      metadata: { email: email?.toLowerCase() }
    });
    
    // ... registration logic ...
    
    // Log success
    await logger.authLog('User registration successful', {
      requestId,
      userId: user._id.toString(),
      ip,
      metadata: { email: user.email }
    });
    
  } catch (error) {
    // Log error
    await logger.logError(error, 'Registration failed', {
      category: 'auth',
      requestId,
      ip
    });
  }
}
```

### API Routes

```typescript
// API route with logging middleware
export const GET = withApiLogging(async (request: NextRequest) => {
  // Your API logic here
  // Logging is handled automatically by middleware
});
```

This advanced logging system provides comprehensive monitoring, debugging, and analytics capabilities for your Next.js application while maintaining performance and security best practices.
