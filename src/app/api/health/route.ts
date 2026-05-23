import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { MONGODB_DB_NAME, resolveMongoUri } from '@/lib/mongo-uri';

export async function GET() {
  try {
    const mongoUri = resolveMongoUri();

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'MONGODB_URI environment variable is not set',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown'
      }, { status: 500 });
    }

    await connectDB();

    return NextResponse.json({
      success: true,
      status: 'healthy',
      message: 'API and database are working correctly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      mongodb: 'connected',
      database: mongoose.connection.name,
      expectedDatabase: MONGODB_DB_NAME,
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
