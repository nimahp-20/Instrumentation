import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { User } from '@/lib/models/User';
import { clearAdminAuthCookies } from '@/lib/auth-cookies';
import { addSecurityHeaders } from '@/lib/security-middleware';

async function adminLogoutHandler(request: AuthenticatedRequest) {
  try {
    const user = await User.findById(request.user?.userId);
    if (user) {
      await user.clearRefreshToken();
    }

    const response = NextResponse.json({
      success: true,
      message: 'از پنل مدیریت خارج شدید',
    });

    clearAdminAuthCookies(response);
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin logout error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطای سرور در خروج' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const POST = withAdminAuth(adminLogoutHandler);
