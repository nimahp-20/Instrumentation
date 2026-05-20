import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-products';

function isSeedAllowed(secretKey: unknown): boolean {
  const expected = process.env.SEED_SECRET;
  if (!expected) return false;
  return typeof secretKey === 'string' && secretKey.length > 0 && secretKey === expected;
}

// GET /api/seed - disabled in production
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Seed endpoint (development only). POST with { secretKey } matching SEED_SECRET.',
  });
}

// POST /api/seed - requires SEED_SECRET env variable
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_SECRET) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  try {
    const { secretKey } = await request.json().catch(() => ({}));

    if (!isSeedAllowed(secretKey)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    console.log('🌱 Starting database seeding...');
    const result = await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
