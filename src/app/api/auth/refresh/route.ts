import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { verifyRefreshToken, generateTokenPair } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validation
    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی الزامی است' 
        },
        { status: 400 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی نامعتبر یا منقضی شده است' 
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'کاربر یافت نشد یا حساب غیرفعال است' 
        },
        { status: 401 }
      );
    }

    // Check token version (for logout all devices functionality)
    if (user.tokenVersion !== payload.tokenVersion) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی منقضی شده است. لطفاً مجدداً وارد شوید' 
        },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tokenVersion
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'توکن‌ها با موفقیت بازخوانی شدند',
        data: {
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Refresh token error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطای سرور در بازخوانی توکن' 
      },
      { status: 500 }
    );
  }
}
