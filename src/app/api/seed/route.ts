import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-products';

// POST /api/seed - Seed the database with random data
export async function POST(request: NextRequest) {
  try {
    // Check if it's a development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Seeding is only allowed in development' },
        { status: 403 }
      );
    }
    
    console.log('🌱 Starting database seeding...');
    const result = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
