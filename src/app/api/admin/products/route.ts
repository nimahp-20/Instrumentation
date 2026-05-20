import { NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { Product, IProduct } from '@/lib/models';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { addSecurityHeaders } from '@/lib/security-middleware';

/**
 * GET /api/admin/products
 * Query: page, limit, filter=all|active|out_of_stock
 */
async function listProductsHandler(req: AuthenticatedRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limitRaw = parseInt(searchParams.get('limit') || '50', 10) || 50;
    const limit = Math.min(100, Math.max(1, limitRaw));
    const filter = (searchParams.get('filter') || 'all').toLowerCase();

    const query: FilterQuery<IProduct> = {};
    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'out_of_stock') {
      query.stock = { $lte: 0 };
    }

    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name nameEn slug')
        .select('-__v')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const response = NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin products list error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در دریافت محصولات' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const GET = withAdminAuth(listProductsHandler);
