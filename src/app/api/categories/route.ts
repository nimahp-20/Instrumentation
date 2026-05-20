import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { Category, ICategory } from '@/lib/models';
import { User } from '@/lib/models/User';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { pickCategoryPayload } from '@/lib/admin-payload';
import { isAllowedCategoryImageValue } from '@/lib/category-image-validation';
import { extractAdminAccessToken } from '@/lib/request-auth';
import { verifyAccessToken } from '@/lib/auth-utils';

async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = extractAdminAccessToken(request);
  if (!token) return false;
  const payload = verifyAccessToken(token);
  if (!payload?.userId) return false;
  const user = await User.findById(payload.userId);
  if (!user?.isActive || user.role !== 'admin') return false;
  if (payload.role && payload.role !== user.role) return false;
  return true;
}

// GET /api/categories - Get all categories (use ?all=1 with admin cookie to include inactive)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || 'sortOrder';
    const search = searchParams.get('search');
    const listAllForAdmin = searchParams.get('all') === '1';

    if (listAllForAdmin) {
      const ok = await isAdminRequest(request);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'برای مشاهده همه دسته‌ها باید مدیر وارد شده باشید' },
          { status: 401 }
        );
      }
    }

    const query: FilterQuery<ICategory> = listAllForAdmin ? {} : { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Add search functionality
    if (search && search.length > 0) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { nameEn: searchRegex },
        { description: searchRegex },
        { descriptionEn: searchRegex },
        { slug: searchRegex }
      ];
    }
    
    let categoriesQuery = Category.find(query)
      .select('-__v')
      .sort({ [sort]: 1 });
    
    if (limit) {
      categoriesQuery = categoriesQuery.limit(parseInt(limit));
    }
    
    const categories = await categoriesQuery.exec();
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (admin only)
async function createCategory(request: AuthenticatedRequest) {
  try {
    await connectToDatabase();

    const raw = await request.json();
    const body = pickCategoryPayload(raw as Record<string, unknown>);

    if (
      !body.name ||
      !body.nameEn ||
      !body.slug ||
      !body.description ||
      !body.descriptionEn ||
      !body.image
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'فیلدهای نام، نام انگلیسی، اسلاگ، توضیحات، توضیحات انگلیسی و تصویر الزامی هستند',
        },
        { status: 400 }
      );
    }

    if (!isAllowedCategoryImageValue(body.image)) {
      return NextResponse.json(
        {
          success: false,
          error: 'آدرس تصویر معتبر نیست؛ از آپلود فایل در پنل یا URL امن https استفاده کنید',
        },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ slug: body.slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = new Category(body);
    await category.save();

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(createCategory);