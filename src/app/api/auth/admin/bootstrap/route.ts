import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { loadRuntimeEnv } from '@/lib/load-runtime-env';

loadRuntimeEnv();

/** One-time admin password reset on production (POST + SEED_SECRET). */
export async function POST(request: NextRequest) {
  const expected = process.env.SEED_SECRET;
  if (!expected) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { secretKey, email, password } = body as {
      secretKey?: string;
      email?: string;
      password?: string;
    };

    if (secretKey !== expected) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const adminEmail = (email || process.env.ADMIN_EMAIL || 'admin@andazeh.ir').toLowerCase();
    const adminPassword = password || process.env.ADMIN_PASSWORD || 'Admin@1404';

    await connectToDatabase();

    let user = await User.findOne({ email: adminEmail });
    if (!user) {
      user = await User.create({
        email: adminEmail,
        password: adminPassword,
        firstName: process.env.ADMIN_FIRST_NAME || 'مدیر',
        lastName: process.env.ADMIN_LAST_NAME || 'ابزارکده',
        phone: process.env.ADMIN_PHONE || '09123456789',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      });
    } else {
      user.password = adminPassword;
      user.role = 'admin';
      user.isActive = true;
      user.emailVerified = true;
      user.hashedRefreshToken = undefined;
      user.tokenVersion = (user.tokenVersion || 1) + 1;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password reset. Login with plain text password (not the bcrypt hash).',
      data: { email: adminEmail },
    });
  } catch (error) {
    console.error('Admin bootstrap error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset admin' },
      { status: 500 }
    );
  }
}
