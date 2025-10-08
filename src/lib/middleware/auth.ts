import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/auth-utils';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: { requireAuth?: boolean; roles?: string[] } = {}
) {
  return async (req: NextRequest) => {
    const { requireAuth = true, roles = [] } = options;

    try {
      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader || undefined);

      if (!token) {
        if (requireAuth) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'دسترسی غیرمجاز - توکن احراز هویت یافت نشد',
              code: 'MISSING_TOKEN'
            },
            { status: 401 }
          );
        }
        // If auth is not required, continue without user
        return handler(req as AuthenticatedRequest);
      }

      // Verify token
      const payload = verifyAccessToken(token);
      if (!payload) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'توکن نامعتبر یا منقضی شده است',
            code: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }

      // Connect to database
      await connectToDatabase();

      // Find user and check if active
      const user = await User.findById(payload.userId);
      if (!user || !user.isActive) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'کاربر یافت نشد یا حساب غیرفعال است',
            code: 'USER_NOT_FOUND'
          },
          { status: 401 }
        );
      }

      // Check role permissions
      if (roles.length > 0 && !roles.includes(user.role)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'شما دسترسی لازم برای این عملیات را ندارید',
            code: 'INSUFFICIENT_PERMISSIONS'
          },
          { status: 403 }
        );
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };

      return handler(authenticatedReq);

    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'خطای سرور در احراز هویت',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export function withOptionalAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { requireAuth: false });
}

/**
 * Admin only middleware
 */
export function withAdminAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { roles: ['admin'] });
}

/**
 * Admin or Moderator middleware
 */
export function withModeratorAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { roles: ['admin', 'moderator'] });
}
