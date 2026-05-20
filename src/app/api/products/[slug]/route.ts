import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product, IProduct } from '@/lib/models';

type ProductWithExtras = Pick<IProduct, 'dimensions' | 'weight' | 'sku'> & {
  material?: string;
  color?: string;
  warranty?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    // Find product by slug
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    const productDetails = product as unknown as ProductWithExtras;

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
    const dimensions = productDetails.dimensions 
      ? `${productDetails.dimensions.length} × ${productDetails.dimensions.width} × ${productDetails.dimensions.height} سانتی‌متر`
      : '۲۵ × ۱۵ × ۱۰ سانتی‌متر';
    
    const specifications = {
      'ابعاد': dimensions,
      'وزن': productDetails.weight ? `${productDetails.weight} گرم` : '۸۰۰ گرم',
      'جنس': productDetails.material || 'فولاد ضد زنگ',
      'رنگ': productDetails.color || 'نقره‌ای',
      'گارانتی': productDetails.warranty || '۲ سال',
      'کشور سازنده': 'آلمان',
      'نوع بسته‌بندی': 'جعبه مقوایی',
      'کد محصول': productDetails.sku,
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
