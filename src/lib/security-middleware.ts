import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP, validateInput, hashSensitiveData } from '@/lib/security';

/**
 * Security middleware for API routes
 */

// Rate limiting configurations
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per window
  keyGenerator: (req) => `auth:${getClientIP(req)}`
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  keyGenerator: (req) => `general:${getClientIP(req)}`
});

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  response.headers.set('Content-Type', 'application/json; charset=utf-8');
  
  // Strict Transport Security (HTTPS only)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';");
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimitConfig: 'auth' | 'general' = 'general'
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const limiter = rateLimitConfig === 'auth' ? authRateLimit : generalRateLimit;
    const result = limiter(req);

    if (!result.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );

      response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

      return addSecurityHeaders(response);
    }

    // Add rate limit headers
    const response = await handler(req);
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return addSecurityHeaders(response);
  };
}

/**
 * Input validation middleware
 */
export function withInputValidation(
  handler: (req: NextRequest) => Promise<NextResponse>,
  validationSchema: Record<string, 'email' | 'password' | 'name' | 'phone' | 'general'>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const errors: Record<string, string> = {};

      // Validate each field according to schema
      for (const [field, type] of Object.entries(validationSchema)) {
        const value = body[field];
        const fieldName = getFieldDisplayName(field);
        
        const validation = validateInput(value, type, fieldName);
        
        if (!validation.valid) {
          errors[field] = validation.error || 'مقدار نامعتبر';
        } else if (validation.sanitized !== undefined) {
          // Update the body with sanitized value
          body[field] = validation.sanitized;
        }
      }

      if (Object.keys(errors).length > 0) {
        const response = NextResponse.json(
          {
            success: false,
            message: 'خطا در اعتبارسنجی اطلاعات',
            errors
          },
          { status: 400 }
        );

        return addSecurityHeaders(response);
      }

      // Create new request with sanitized body
      const sanitizedReq = new NextRequest(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(body)
      });

      return await handler(sanitizedReq);

    } catch (error) {
      console.error('Input validation error:', error);
      
      const response = NextResponse.json(
        {
          success: false,
          message: 'خطا در پردازش درخواست'
        },
        { status: 400 }
      );

      return addSecurityHeaders(response);
    }
  };
}

/**
 * Get display name for field
 */
function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    email: 'ایمیل',
    password: 'رمز عبور',
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    phone: 'شماره تلفن',
    confirmPassword: 'تأیید رمز عبور'
  };

  return fieldNames[field] || field;
}

/**
 * Logging middleware for security events
 */
export function withSecurityLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  eventType: string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    try {
      const response = await handler(req);
      const duration = Date.now() - startTime;

      // Log successful requests
      console.log(`[SECURITY] ${eventType} - SUCCESS`, {
        ip: hashSensitiveData(clientIP),
        userAgent: userAgent.substring(0, 100),
        duration,
        status: response.status,
        timestamp: new Date().toISOString()
      });

      return response;

    } catch (error) {
      const duration = Date.now() - startTime;

      // Log failed requests
      console.error(`[SECURITY] ${eventType} - ERROR`, {
        ip: hashSensitiveData(clientIP),
        userAgent: userAgent.substring(0, 100),
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  };
}

/**
 * Comprehensive security middleware combining all protections
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: 'auth' | 'general';
    validation?: Record<string, 'email' | 'password' | 'name' | 'phone' | 'general'>;
    eventType?: string;
  } = {}
) {
  let middleware = handler;

  // Add logging
  if (options.eventType) {
    middleware = withSecurityLogging(middleware, options.eventType);
  }

  // Add input validation
  if (options.validation) {
    middleware = withInputValidation(middleware, options.validation);
  }

  // Add rate limiting
  if (options.rateLimit) {
    middleware = withRateLimit(middleware, options.rateLimit);
  }

  return middleware;
}

/**
 * CORS configuration for API routes
 */
export function addCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com', // Replace with your production domain
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleOPTIONS(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCORSHeaders(response);
}
