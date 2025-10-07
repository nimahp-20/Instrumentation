import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { User } from '@/lib/models/User';

async function getProfileHandler(request: AuthenticatedRequest) {
  try {
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

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get profile error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطای سرور در دریافت اطلاعات کاربر' 
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getProfileHandler);
