import connectDB from './mongodb';
import seedDatabase from './seed';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up MongoDB database "tools"...');
    
    // Test connection
    await connectDB();
    console.log('✅ Successfully connected to MongoDB database "tools"');
    
    // Run seeding
    await seedDatabase();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Your "tools" database is ready to use');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Check your MONGODB_URI in .env.local');
    console.log('3. Ensure MongoDB Compass can connect to localhost:27017');
    console.log('4. Create a database named "tools" in MongoDB Compass');
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export default setupDatabase;
