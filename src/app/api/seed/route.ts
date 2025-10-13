import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-products';

// GET /api/seed - Check if seeding is available
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Seed endpoint is available. Use POST with secretKey for production.',
    production: process.env.NODE_ENV === 'production'
  });
}

// POST /api/seed - Seed the database with random data
export async function POST(request: NextRequest) {
  try {
    // Allow seeding in production with a secret key for security
    const { secretKey } = await request.json().catch(() => ({}));
    
    if (process.env.NODE_ENV === 'production' && secretKey !== 'seed-production-2024') {
      return NextResponse.json(
        { success: false, error: 'Invalid secret key for production seeding' },
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
