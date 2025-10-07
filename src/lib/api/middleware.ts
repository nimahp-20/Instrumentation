import { NextRequest } from 'next/server';
import { createErrorResponse } from './utils';

// Rate Limiting (Simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  requests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    // Clean up old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
    
    const current = rateLimitMap.get(ip);
    
    if (!current) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return null;
    }
    
    if (current.resetTime < now) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return null;
    }
    
    if (current.count >= requests) {
      return createErrorResponse('Rate limit exceeded', 429);
    }
    
    current.count++;
    return null;
  };
}

// CORS Middleware
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Authentication Middleware (Basic JWT implementation)
export function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return createErrorResponse('Access token required', 401);
  }
  
  // In a real app, you would verify the JWT token here
  // For now, we'll just check if it exists
  try {
    // Mock token verification
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return { userId: payload.userId, email: payload.email };
  } catch {
    return createErrorResponse('Invalid token', 401);
  }
}

// Request Logging Middleware
export function logRequest(req: NextRequest) {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
}
