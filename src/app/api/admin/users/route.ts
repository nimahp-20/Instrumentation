import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { addSecurityHeaders } from '@/lib/security-middleware';

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listUsersHandler(req: AuthenticatedRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limitRaw = parseInt(searchParams.get('limit') || '30', 10) || 30;
    const limit = Math.min(100, Math.max(1, limitRaw));
    const q = (searchParams.get('q') || '').trim();

    const filter: Record<string, unknown> = {};
    if (q.length > 0) {
      const safe = escapeRegex(q);
      filter.$or = [
        { email: { $regex: safe, $options: 'i' } },
        { firstName: { $regex: safe, $options: 'i' } },
        { lastName: { $regex: safe, $options: 'i' } },
      ];
    }

    const [totalCount, docs] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password -hashedRefreshToken')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const users = docs.map((u) => ({
      id: String(u._id),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));

    const response = NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin users list error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در دریافت فهرست کاربران' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const GET = withAdminAuth(listUsersHandler);
