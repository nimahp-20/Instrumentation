import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { generateTokenPair } from '@/lib/auth-utils';
import { addSecurityHeaders } from '@/lib/security-middleware';
import { validateInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Comprehensive input validation
    const errors: Record<string, string> = {};

    // Validate email
    const emailValidation = validateInput(email, 'email');
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'ایمیل نامعتبر است';
    }

    // Validate password
    const passwordValidation = validateInput(password, 'password');
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error || 'رمز عبور نامعتبر است';
    }

    // Return validation errors if any
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

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const response = NextResponse.json(
        { 
          success: false, 
          message: 'ایمیل یا رمز عبور اشتباه است' 
        },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    // Check if user is active
    if (!user.isActive) {
      const response = NextResponse.json(
        { 
          success: false, 
          message: 'حساب کاربری شما غیرفعال است. لطفاً با پشتیبانی تماس بگیرید' 
        },
        { status: 403 }
      );
      return addSecurityHeaders(response);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const response = NextResponse.json(
        { 
          success: false, 
          message: 'ایمیل یا رمز عبور اشتباه است' 
        },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    // Generate tokens
    const tokens = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tokenVersion
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'ورود با موفقیت انجام شد',
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
            createdAt: user.createdAt
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn
          }
        }
      },
      { status: 200 }
    );
    
    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Login error:', error);
    
    const response = NextResponse.json(
      { 
        success: false, 
        message: 'خطای سرور در ورود' 
      },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}
