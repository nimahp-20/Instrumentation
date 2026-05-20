import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { generateTokenPair } from '@/lib/auth-utils';
import { addSecurityHeaders, withRateLimit } from '@/lib/security-middleware';
import { validateInput } from '@/lib/security';
import { setAdminAuthCookies } from '@/lib/auth-cookies';

async function adminLoginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const errors: Record<string, string> = {};

    const emailValidation = validateInput(email, 'email');
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'ایمیل نامعتبر است';
    }

    const passwordValidation = validateInput(password, 'password');
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error || 'رمز عبور نامعتبر است';
    }

    if (Object.keys(errors).length > 0) {
      const response = NextResponse.json(
        { success: false, message: 'خطا در اعتبارسنجی اطلاعات', errors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic message — do not reveal whether email exists
    const invalidCredentials = () =>
      NextResponse.json(
        { success: false, message: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );

    if (!user) {
      return addSecurityHeaders(invalidCredentials());
    }

    if (user.role !== 'admin') {
      return addSecurityHeaders(invalidCredentials());
    }

    if (!user.isActive) {
      const response = NextResponse.json(
        { success: false, message: 'حساب مدیر غیرفعال است' },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return addSecurityHeaders(invalidCredentials());
    }

    const tokens = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tokenVersion
    );

    await user.setRefreshToken(tokens.refreshToken);
    user.lastLogin = new Date();
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: 'ورود به پنل مدیریت با موفقیت انجام شد',
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
        },
        expiresIn: tokens.expiresIn,
      },
    });

    setAdminAuthCookies(response, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin login error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطای سرور در ورود' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const POST = withRateLimit(adminLoginHandler, 'admin-auth');
