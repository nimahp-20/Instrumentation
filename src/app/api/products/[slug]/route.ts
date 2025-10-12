import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();

    // Find product by slug
    const product = await Product.findOne({ slug: params.slug })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    // Add mock reviews for demonstration
    const reviews = [
      {
        id: '1',
        user: 'احمد محمدی',
        rating: 5,
        comment: 'محصول عالی و با کیفیت. توصیه می‌کنم.',
        date: '۱۴۰۳/۰۱/۱۵'
      },
      {
        id: '2',
        user: 'سارا احمدی',
        rating: 4,
        comment: 'کیفیت خوبی دارد ولی قیمت کمی بالاست.',
        date: '۱۴۰۳/۰۱/۱۰'
      },
      {
        id: '3',
        user: 'علی رضایی',
        rating: 5,
        comment: 'ارسال سریع و بسته‌بندی مناسب. راضی هستم.',
        date: '۱۴۰۳/۰۱/۰۸'
      }
    ];

    // Add detailed specifications based on category
    const dimensions = (product as any).dimensions 
      ? `${(product as any).dimensions.length} × ${(product as any).dimensions.width} × ${(product as any).dimensions.height} سانتی‌متر`
      : '۲۵ × ۱۵ × ۱۰ سانتی‌متر';
    
    const specifications = {
      'ابعاد': dimensions,
      'وزن': (product as any).weight ? `${(product as any).weight} گرم` : '۸۰۰ گرم',
      'جنس': (product as any).material || 'فولاد ضد زنگ',
      'رنگ': (product as any).color || 'نقره‌ای',
      'گارانتی': (product as any).warranty || '۲ سال',
      'کشور سازنده': 'آلمان',
      'نوع بسته‌بندی': 'جعبه مقوایی',
      'کد محصول': (product as any).sku,
    };

    // Add features based on product type
    const features = [
      'کیفیت بالا و دوام طولانی',
      'مناسب برای استفاده حرفه‌ای',
      'طراحی ارگونومیک',
      'ضد زنگ و ضد خوردگی',
      'قابلیت استفاده چند منظوره'
    ];

    const productWithDetails = {
      ...product,
      reviews,
      specifications,
      features
    };

    return NextResponse.json({
      success: true,
      product: productWithDetails
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات محصول' },
      { status: 500 }
    );
  }
}