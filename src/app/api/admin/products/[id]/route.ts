import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { Product, Category } from '@/lib/models';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { pickProductPayload } from '@/lib/admin-payload';
import {
  mergeDiscountPercentIntoProductPayload,
  parseDiscountPercent,
  resolveProductBasePriceAndDiscount,
} from '@/lib/product-discount';
import { addSecurityHeaders } from '@/lib/security-middleware';
import { assertProductImageUrlsAllowed, isAllowedProductImageUrl } from '@/lib/product-image-validation';

async function getProduct(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response = NextResponse.json({ success: false, message: 'شناسه نامعتبر است' }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const product = await Product.findById(id)
      .populate('category', 'name nameEn slug')
      .select('-__v')
      .lean();

    if (!product) {
      const response = NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, product });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin product get error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در دریافت محصول' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

async function patchProduct(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response = NextResponse.json({ success: false, message: 'شناسه نامعتبر است' }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const product = await Product.findById(id);
    if (!product) {
      const response = NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const raw = (await req.json()) as Record<string, unknown>;
    const body = pickProductPayload(raw);

    if (Object.prototype.hasOwnProperty.call(raw, 'discountPercent')) {
      const pct = parseDiscountPercent(raw.discountPercent);
      if (pct === null) {
        const response = NextResponse.json(
          { success: false, message: 'درصد تخفیف باید عددی بین ۰ تا ۱۰۰ باشد.' },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
      const fallback =
        body.price === undefined
          ? resolveProductBasePriceAndDiscount(product).basePrice
          : undefined;
      const merged = mergeDiscountPercentIntoProductPayload(body, pct, fallback);
      if (!merged.ok) {
        const response = NextResponse.json({ success: false, message: merged.message }, { status: 400 });
        return addSecurityHeaders(response);
      }
    }

    if (typeof body.slug === 'string') {
      body.slug = body.slug.trim().toLowerCase();
      const dup = await Product.findOne({ slug: body.slug, _id: { $ne: product._id } });
      if (dup) {
        const response = NextResponse.json(
          { success: false, message: 'اسلاگ تکراری است؛ اسلاگ دیگری انتخاب کنید.' },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    if (body.category) {
      const cat = await Category.findById(body.category as string);
      if (!cat) {
        const response = NextResponse.json({ success: false, message: 'دسته‌بندی یافت نشد' }, { status: 400 });
        return addSecurityHeaders(response);
      }
    }

    if (typeof body.sku === 'string') {
      body.sku = body.sku.trim().toUpperCase();
      const dupSku = await Product.findOne({ sku: body.sku, _id: { $ne: product._id } });
      if (dupSku) {
        const response = NextResponse.json(
          { success: false, message: 'کد SKU تکراری است.' },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    const images = body.images as unknown;
    if (Array.isArray(images) && images.length === 0) {
      const response = NextResponse.json(
        { success: false, message: 'حداقل یک تصویر لازم است.' },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    if (Array.isArray(images) && images.length > 0) {
      const imgErr = assertProductImageUrlsAllowed(images, 'تصاویر');
      if (imgErr) {
        const response = NextResponse.json({ success: false, message: imgErr }, { status: 400 });
        return addSecurityHeaders(response);
      }
    }

    if (body.thumbnail !== undefined && body.thumbnail !== null && String(body.thumbnail).trim() !== '') {
      if (!isAllowedProductImageUrl(body.thumbnail)) {
        const response = NextResponse.json(
          { success: false, message: 'آدرس تصویر شاخص نامعتبر یا غیرمجاز است' },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    const unsetOriginal = body.originalPrice === null;
    if (unsetOriginal) {
      delete body.originalPrice;
    }

    Object.assign(product, body);

    if (unsetOriginal) {
      product.set('originalPrice', undefined);
    }

    await product.save();
    await product.populate('category', 'name nameEn slug');

    const response = NextResponse.json({ success: true, product });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin product patch error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی محصول' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

async function deleteProduct(_req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response = NextResponse.json({ success: false, message: 'شناسه نامعتبر است' }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const product = await Product.findById(id);
    if (!product) {
      const response = NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await product.deleteOne();

    const response = NextResponse.json({ success: true, message: 'محصول حذف شد' });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Admin product delete error:', error);
    const response = NextResponse.json(
      { success: false, message: 'خطا در حذف محصول' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withAdminAuth((req) => getProduct(req, context))(request);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withAdminAuth((req) => patchProduct(req, context))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withAdminAuth((req) => deleteProduct(req, context))(request);
}
