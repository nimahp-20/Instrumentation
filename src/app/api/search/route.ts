import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category, Product } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const limitParam = searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '10', 10), 25);

    if (q.length < 2) {
      return NextResponse.json({ success: true, data: { products: [], categories: [] }, query: q, total: 0 });
    }

    const re = new RegExp(q, 'i');

    const [products, categories] = await Promise.all([
      Product.find({
        isActive: true,
        $or: [
          { name: re },
          { nameEn: re },
          { description: re },
          { slug: re }
        ]
      })
        .select('name nameEn slug price images rating reviewCount')
        .sort({ rating: -1, reviewCount: -1 })
        .limit(limit)
        .exec(),
      Category.find({
        isActive: true,
        $or: [
          { name: re },
          { nameEn: re },
          { description: re },
          { slug: re }
        ]
      })
        .select('name nameEn slug description image productCount')
        .sort({ productCount: -1, sortOrder: 1 })
        .limit(limit)
        .exec()
    ]);

    const data = {
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        images: p.images,
        rating: p.rating,
        reviewCount: p.reviewCount,
        url: `/products/${p.slug}`
      })),
      categories: categories.map(c => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        productCount: c.productCount,
        url: `/categories/${c.slug}`
      }))
    };

    return NextResponse.json({ success: true, data, query: q, total: data.products.length + data.categories.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
