import mongoose from 'mongoose';
import { loadRuntimeEnv } from '@/lib/load-runtime-env';
import {
  assertToolsDatabase,
  getMongoHostForLog,
  MONGODB_DB_NAME,
  resolveMongoUri,
} from '@/lib/mongo-uri';

loadRuntimeEnv();

function getMongoUri(): string {
  return resolveMongoUri();
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = getMongoUri();

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables!');
    throw new Error('MONGODB_URI is not defined. Please add it to your environment variables.');
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      dbName: MONGODB_DB_NAME,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log(`📂 Host: ${getMongoHostForLog(MONGODB_URI)} | Database: ${MONGODB_DB_NAME}`);

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      assertToolsDatabase(mongoose.connection.name);
      console.log(`✅ Connected to MongoDB database "${mongoose.connection.name}"`);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      cached!.promise = null; // Reset promise on error
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
