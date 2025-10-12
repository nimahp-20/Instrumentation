import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product, Category } from '@/lib/models';

// GET /api/products - Get all products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const newProducts = searchParams.get('new');
    const onSale = searchParams.get('onSale');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const brand = searchParams.get('brand');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');
    const exclude = searchParams.get('exclude');
    
    // Build query
    let query: any = { isActive: true };
    
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (newProducts === 'true') {
      query.isNew = true;
    }
    
    if (onSale === 'true') {
      query.isOnSale = true;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      query.stock = { $eq: 0 };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameEn: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (exclude) {
      query._id = { $ne: exclude };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sortObj: any = {};
    
    // Handle different sort options
    switch (sort) {
      case 'price':
        sortObj.price = order === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortObj.rating = order === 'desc' ? -1 : 1;
        break;
      case 'name':
        sortObj.name = order === 'desc' ? -1 : 1;
        break;
      case 'createdAt':
        sortObj.createdAt = order === 'desc' ? -1 : 1;
        break;
      case 'updatedAt':
        sortObj.updatedAt = order === 'desc' ? -1 : 1;
        break;
      case 'popularity':
        sortObj.reviewCount = order === 'desc' ? -1 : 1;
        break;
      case 'stock':
        sortObj.stock = order === 'desc' ? -1 : 1;
        break;
      default:
        sortObj.createdAt = order === 'desc' ? -1 : 1;
    }
    
    // Execute queries
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name nameEn slug')
        .select('-__v')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      Product.countDocuments(query)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Get available brands for filtering
    const brands = await Product.distinct('brand', query);

    return NextResponse.json({
      success: true,
      products: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        brands,
        priceRange: {
          min: await Product.findOne(query).sort({ price: 1 }).select('price').lean().then(p => (p as any)?.price || 0),
          max: await Product.findOne(query).sort({ price: -1 }).select('price').lean().then(p => (p as any)?.price || 0)
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, category, and price are required' },
        { status: 400 }
      );
    }
    
    // Check if product with same slug exists
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const category = await Category.findById(body.category);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 400 }
      );
    }
    
    const product = new Product(body);
    await product.save();
    
    // Populate category for response
    await product.populate('category', 'name nameEn slug');
    
    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
