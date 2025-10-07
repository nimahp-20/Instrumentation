import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category } from '@/lib/models';

// GET /api/categories/search - Search categories with autocomplete
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '10';
    
    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Please provide a search query'
      });
    }
    
    // Search in both Persian and English names, and descriptions
    const searchRegex = new RegExp(query, 'i');
    
    const categories = await Category.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: searchRegex },
            { nameEn: searchRegex },
            { description: searchRegex },
            { descriptionEn: searchRegex },
            { slug: searchRegex }
          ]
        }
      ]
    })
    .select('name nameEn slug description descriptionEn image productCount')
    .sort({ productCount: -1, sortOrder: 1 })
    .limit(parseInt(limit))
    .exec();
    
    // Format results for autocomplete
    const searchResults = categories.map(category => ({
      _id: category._id,
      name: category.name,
      nameEn: category.nameEn,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category.productCount,
      href: `/categories/${category.slug}`,
      // Highlight matching text for better UX
      matchType: getMatchType(category, query)
    }));
    
    return NextResponse.json({
      success: true,
      data: searchResults,
      count: searchResults.length,
      query: query
    });
    
  } catch (error) {
    console.error('Error searching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search categories' },
      { status: 500 }
    );
  }
}

// Helper function to determine match type for highlighting
function getMatchType(category: any, query: string): string {
  const queryLower = query.toLowerCase();
  
  if (category.name.toLowerCase().includes(queryLower)) {
    return 'name';
  } else if (category.nameEn.toLowerCase().includes(queryLower)) {
    return 'nameEn';
  } else if (category.description.toLowerCase().includes(queryLower)) {
    return 'description';
  } else if (category.slug.toLowerCase().includes(queryLower)) {
    return 'slug';
  }
  
  return 'description';
}
