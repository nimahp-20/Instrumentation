import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if MongoDB URI is configured
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'MONGODB_URI environment variable is not set',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown'
      }, { status: 500 });
    }

    // Try to connect to MongoDB
    await connectDB();

    return NextResponse.json({
      success: true,
      status: 'healthy',
      message: 'API and database are working correctly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      mongodb: 'connected'
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      mongodb: 'disconnected'
    }, { status: 500 });
  }
}
