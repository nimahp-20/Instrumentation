import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category, Product } from '@/lib/models';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || 'sortOrder';
    const search = searchParams.get('search');
    
    let query: any = { isActive: true };
    
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

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }
    
    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ slug: body.slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    
    const category = new Category(body);
    await category.save();
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}