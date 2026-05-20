import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category, Product } from '@/lib/models';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { pickCategoryPayload } from '@/lib/admin-payload';
import { isAllowedCategoryImageValue } from '@/lib/category-image-validation';

// GET /api/categories/[slug] - Get category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const category = await Category.findOne({
      slug: slug,
      isActive: true,
    }).select('-__v');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[slug] - Update category (admin only)
async function updateCategory(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const raw = await request.json();
    const body = pickCategoryPayload(raw as Record<string, unknown>);
    delete body.slug;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'هیچ فیلدی برای به‌روزرسانی ارسال نشده است' },
        { status: 400 }
      );
    }

    if (body.image !== undefined && !isAllowedCategoryImageValue(body.image)) {
      return NextResponse.json(
        {
          success: false,
          error: 'آدرس تصویر معتبر نیست؛ از آپلود فایل در پنل یا URL امن https استفاده کنید',
        },
        { status: 400 }
      );
    }

    const category = await Category.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[slug] - Delete category (admin only)
async function deleteCategory(
  _request: AuthenticatedRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `این دسته ${productCount.toLocaleString('fa-IR')} محصول دارد؛ ابتدا محصولات را منتقل یا حذف کنید`,
        },
        { status: 400 }
      );
    }

    await category.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return withAdminAuth((req) => updateCategory(req, context))(request);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return withAdminAuth((req) => deleteCategory(req, context))(request);
}
