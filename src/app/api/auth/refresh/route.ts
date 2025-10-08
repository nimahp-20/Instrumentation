import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { verifyRefreshToken, generateTokenPair } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Validation
    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی یافت نشد' 
        },
        { status: 403 }
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
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user and include hashedRefreshToken
    const user = await User.findById(payload.userId).select('+hashedRefreshToken');
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'کاربر یافت نشد یا حساب غیرفعال است' 
        },
        { status: 403 }
      );
    }

    // Check token version (for logout all devices functionality)
    if (user.tokenVersion !== payload.tokenVersion) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی منقضی شده است. لطفاً مجدداً وارد شوید' 
        },
        { status: 403 }
      );
    }

    // Verify refresh token against hashed version in database
    const isRefreshTokenValid = await user.compareRefreshToken(refreshToken);
    if (!isRefreshTokenValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن بازخوانی نامعتبر است' 
        },
        { status: 403 }
      );
    }

    // Generate new tokens
    const tokens = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tokenVersion
    );

    // Save new hashed refresh token to database
    await user.setRefreshToken(tokens.refreshToken);

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'توکن‌ها با موفقیت بازخوانی شدند',
        data: {
          tokens: {
            accessToken: tokens.accessToken,
            expiresIn: tokens.expiresIn
          }
        }
      },
      { status: 200 }
    );

    // Set new HTTP-only cookie for refresh token
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60, // 2 minutes for testing
      path: '/'
    });

    return response;

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
