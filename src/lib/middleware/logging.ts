import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/security';

export interface LoggingMiddlewareOptions {
  logRequestBody?: boolean;
  logResponseBody?: boolean;
  excludePaths?: string[];
  includeHeaders?: string[];
  maxBodySize?: number;
}

export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: LoggingMiddlewareOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    const method = req.method;
    const url = req.url;
    const pathname = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent') || '';
    const ip = getClientIP(req);

    // Skip logging for excluded paths
    if (options.excludePaths?.some(path => pathname.startsWith(path))) {
      return handler(req);
    }

    // Extract user ID from headers or token if available
    const authHeader = req.headers.get('authorization');
    let userId: string | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        // You can decode JWT token here to get user ID
        // For now, we'll extract it from a custom header
        userId = req.headers.get('x-user-id') || undefined;
      } catch (error) {
        // Silent fail for token parsing
      }
    }

    // Log request start
    await logger.apiLog(`Request started: ${method} ${pathname}`, {
      requestId,
      userId,
      ip,
      userAgent,
      method,
      url,
      metadata: {
        headers: options.includeHeaders ? 
          Object.fromEntries(
            options.includeHeaders.map(header => [header, req.headers.get(header)])
          ) : {},
        query: Object.fromEntries(req.nextUrl.searchParams),
        timestamp: new Date().toISOString()
      }
    });

    // Log request body if enabled and not too large
    if (options.logRequestBody && req.body) {
      try {
        const body = await req.clone().text();
        if (body && body.length <= (options.maxBodySize || 1000)) {
          await logger.debug(`Request body: ${body}`, {
            category: 'api',
            context: {
              requestId,
              userId,
              ip,
              method,
              url: pathname
            }
          });
        }
      } catch (error) {
        // Silent fail for body logging
      }
    }

    let response: NextResponse;
    let error: Error | null = null;

    try {
      response = await handler(req);
    } catch (err) {
      error = err as Error;
      response = NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const statusCode = response.status;

    // Log response
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    await logger.logRequest(method, pathname, statusCode, responseTime, {
      requestId,
      userId,
      ip,
      userAgent,
      metadata: {
        responseHeaders: options.includeHeaders ? 
          Object.fromEntries(
            options.includeHeaders.map(header => [header, response.headers.get(header)])
          ) : {},
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined
      }
    });

    // Log error details if there was an error
    if (error) {
      await logger.logError(error, `Request failed: ${method} ${pathname}`, {
        category: 'api',
        context: {
          requestId,
          userId,
          ip,
          method,
          url: pathname,
          statusCode,
          responseTime
        }
      });
    }

    // Log response body if enabled and not too large
    if (options.logResponseBody && response.body) {
      try {
        const responseClone = response.clone();
        const body = await responseClone.text();
        if (body && body.length <= (options.maxBodySize || 1000)) {
          await logger.debug(`Response body: ${body}`, {
            category: 'api',
            context: {
              requestId,
              userId,
              ip,
              method,
              url: pathname,
              statusCode
            }
          });
        }
      } catch (error) {
        // Silent fail for response body logging
      }
    }

    return response;
  };
}

// Convenience function for API routes
export function withApiLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: LoggingMiddlewareOptions = {}
) {
  const defaultOptions: LoggingMiddlewareOptions = {
    logRequestBody: false,
    logResponseBody: false,
    excludePaths: ['/api/health', '/api/logs'],
    includeHeaders: ['content-type', 'authorization', 'x-user-id'],
    maxBodySize: 1000,
    ...options
  };

  return withLogging(handler, defaultOptions);
}

// Convenience function for authentication routes
export function withAuthLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: LoggingMiddlewareOptions = {}
) {
  const defaultOptions: LoggingMiddlewareOptions = {
    logRequestBody: true,
    logResponseBody: false,
    includeHeaders: ['content-type', 'user-agent'],
    maxBodySize: 500,
    ...options
  };

  return withLogging(handler, defaultOptions);
}
