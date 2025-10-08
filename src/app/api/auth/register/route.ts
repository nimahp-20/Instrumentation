import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { generateTokenPair } from '@/lib/auth-utils';
import { addSecurityHeaders, withSecurity } from '@/lib/security-middleware';
import { validateInput } from '@/lib/security';
import { logger } from '@/lib/logger';
import { getClientIP } from '@/lib/security';

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Log registration attempt
    await logger.authLog('User registration attempt', {
      requestId,
      ip,
      userAgent,
      metadata: {
        email: email?.toLowerCase(),
        hasPassword: !!password,
        firstName: firstName?.substring(0, 10) + '...',
        lastName: lastName?.substring(0, 10) + '...',
        hasPhone: !!phone
      }
    });

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

    // Validate names
    const firstNameValidation = validateInput(firstName, 'name', 'نام');
    if (!firstNameValidation.valid) {
      errors.firstName = firstNameValidation.error || 'نام نامعتبر است';
    }

    const lastNameValidation = validateInput(lastName, 'name', 'نام خانوادگی');
    if (!lastNameValidation.valid) {
      errors.lastName = lastNameValidation.error || 'نام خانوادگی نامعتبر است';
    }

    // Validate phone (optional)
    if (phone) {
      const phoneValidation = validateInput(phone, 'phone');
      if (!phoneValidation.valid) {
        errors.phone = phoneValidation.error || 'شماره تلفن نامعتبر است';
      }
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      await logger.warn('Registration validation failed', {
        category: 'auth',
        context: {
          requestId,
          ip,
          userAgent,
          metadata: {
            email: email?.toLowerCase(),
            errors: Object.keys(errors),
            errorCount: Object.keys(errors).length
          }
        }
      });

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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await logger.securityLog('Registration attempt with existing email', {
        requestId,
        ip,
        userAgent,
        metadata: {
          email: email.toLowerCase(),
          existingUserId: existingUser._id.toString()
        }
      });

      const response = NextResponse.json(
        {
          success: false,
          message: 'کاربری با این ایمیل قبلاً ثبت نام کرده است'
        },
        { status: 409 }
      );
      return addSecurityHeaders(response);
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      role: 'user',
      isActive: true,
      emailVerified: false,
      tokenVersion: 1
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tokenVersion
    );

    // Save hashed refresh token to database
    await user.setRefreshToken(tokens.refreshToken);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log successful registration
    await logger.authLog('User registration successful', {
      requestId,
      userId: user._id.toString(),
      ip,
      userAgent,
      metadata: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        hasPhone: !!user.phone
      }
    });

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'ثبت نام با موفقیت انجام شد',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt
          },
          tokens: {
            accessToken: tokens.accessToken,
            expiresIn: tokens.expiresIn
          }
        }
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for refresh token
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60, // 2 minutes for testing
      path: '/'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Registration error:', error);
    
    // Log registration error
    await logger.logError(error as Error, 'Registration process failed', {
      category: 'auth',
      context: {
        requestId,
        ip,
        userAgent,
        metadata: {
          errorType: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      }
    });
    
    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      if (error.message.includes('email')) {
        validationErrors.email = 'ایمیل نامعتبر است';
      }
      if (error.message.includes('password')) {
        validationErrors.password = 'رمز عبور نامعتبر است';
      }

      const response = NextResponse.json(
        {
          success: false,
          message: 'خطا در اعتبارسنجی اطلاعات',
          errors: validationErrors
        },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json(
      {
        success: false,
        message: 'خطای سرور در ثبت نام'
      },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}
