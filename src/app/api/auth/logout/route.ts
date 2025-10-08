import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { User } from '@/lib/models/User';

async function logoutHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { logoutAll = false } = body;

    // Get user from middleware
    const user = await User.findById(request.user?.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'کاربر یافت نشد' 
        },
        { status: 404 }
      );
    }

    if (logoutAll) {
      // Increment token version to invalidate all refresh tokens
      await user.incrementTokenVersion();
    } else {
      // Clear current refresh token
      await user.clearRefreshToken();
    }

    const response = NextResponse.json(
      {
        success: true,
        message: logoutAll ? 'از تمام دستگاه‌ها خارج شدید' : 'با موفقیت خارج شدید'
      },
      { status: 200 }
    );

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطای سرور در خروج' 
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(logoutHandler);
