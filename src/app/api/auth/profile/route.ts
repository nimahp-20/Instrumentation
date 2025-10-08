import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن دسترسی یافت نشد' 
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const payload = verifyAccessToken(accessToken);
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن دسترسی نامعتبر یا منقضی شده است' 
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
        { status: 404 }
      );
    }

    // Return user profile (excluding sensitive data)
    return NextResponse.json({
      success: true,
      message: 'اطلاعات کاربر با موفقیت دریافت شد',
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
    });

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

export async function PUT(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن دسترسی یافت نشد' 
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const payload = verifyAccessToken(accessToken);
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'توکن دسترسی نامعتبر یا منقضی شده است' 
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'نام، نام خانوادگی و ایمیل الزامی است' 
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'فرمت ایمیل نامعتبر است' 
        },
        { status: 400 }
      );
    }

    // Phone validation (optional)
    if (phone && phone.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'شماره تماس باید حداقل ۱۰ رقم باشد' 
        },
        { status: 400 }
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
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'این ایمیل قبلاً استفاده شده است' 
          },
          { status: 400 }
        );
      }
    }

    // Update user profile
    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    user.email = email.toLowerCase().trim();
    user.phone = phone?.trim() || '';
    user.updatedAt = new Date();

    // If email changed, mark as unverified
    if (email !== user.email) {
      user.emailVerified = false;
    }

    await user.save();

    // Return updated user profile
    return NextResponse.json({
      success: true,
      message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد',
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
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطای سرور در به‌روزرسانی اطلاعات کاربر' 
      },
      { status: 500 }
    );
  }
}