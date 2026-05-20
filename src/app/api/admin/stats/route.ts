import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product, Category } from '@/lib/models';
import { User } from '@/lib/models/User';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { addSecurityHeaders } from '@/lib/security-middleware';

async function statsHandler(_req: AuthenticatedRequest) {
  try {
    await connectToDatabase();

    const [products, categories, users, lowStock] = await Promise.all([
      Product.countDocuments({}),
      Category.countDocuments({}),
      User.countDocuments({}),
      Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
    ]);

    const response = NextResponse.json({
      success: true,
      data: { products, categories, users, lowStock },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin stats error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const GET = withAdminAuth(statsHandler);
