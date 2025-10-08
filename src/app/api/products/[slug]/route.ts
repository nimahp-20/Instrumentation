import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/lib/models';

// GET /api/products/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const product = await Product.findOne({ 
      slug: slug, 
      isActive: true 
    })
    .populate('category', 'name nameEn slug')
    .populate('subcategory', 'name nameEn slug')
    .select('-__v');
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const body = await request.json();
    
    const product = await Product.findOneAndUpdate(
      { slug: slug },
      body,
      { new: true, runValidators: true }
    )
    .populate('category', 'name nameEn slug')
    .populate('subcategory', 'name nameEn slug')
    .select('-__v');
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    const product = await Product.findOneAndDelete({ slug: slug });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
