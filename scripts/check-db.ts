import mongoose from 'mongoose';
import { loadEnvFiles } from '../src/lib/load-env';
import {
  assertToolsDatabase,
  MONGODB_DB_NAME,
  resolveMongoUri,
} from '../src/lib/mongo-uri';

loadEnvFiles();

const MONGODB_URI = resolveMongoUri();

console.log('🔍 Checking MongoDB connection...\n');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

console.log('📍 MongoDB URI found');
console.log('🔗 Connecting to:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
console.log(`📂 Expected database: ${MONGODB_DB_NAME}\n`);

mongoose
  .connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    assertToolsDatabase(mongoose.connection.name);
    console.log('✅ SUCCESS! MongoDB is running and connected!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('MongoDB connection has no database handle');
    }
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections in database:');
    if (collections.length === 0) {
      console.log('   (No collections yet — run npm run seed-all)');
    } else {
      for (const col of collections) {
        console.log(`   - ${col.name}`);
      }
    }
    console.log('\n🎉 Reading from database "tools" only.');
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error: Error) => {
    console.error('❌ FAILED! Could not connect to MongoDB\n');
    console.error('Error:', error.message);
    await mongoose.connection.close().catch(() => undefined);
    process.exit(1);
  });
