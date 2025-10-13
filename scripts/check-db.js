// Simple script to check if MongoDB is running
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Try to load .env.local manually
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim();
    }
  }
}

console.log('🔍 Checking MongoDB connection...\n');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  console.log('\n📝 To fix this:');
  console.log('1. Create a .env.local file in the root directory');
  console.log('2. Add: MONGODB_URI=your_mongodb_connection_string');
  console.log('\n💡 Or use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas/register\n');
  process.exit(1);
}

console.log('📍 MongoDB URI found');
console.log('🔗 Connecting to:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
console.log('');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ SUCCESS! MongoDB is running and connected!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('');
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    console.log('📦 Collections in database:');
    if (collections.length === 0) {
      console.log('   (No collections yet - database is empty)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    console.log('');
    console.log('🎉 Your database is working perfectly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! Could not connect to MongoDB');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Possible issues:');
      console.log('   - MongoDB server is not running');
      console.log('   - Wrong connection string');
      console.log('   - Network/firewall blocking connection');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Possible issues:');
      console.log('   - Wrong username or password');
      console.log('   - User not created in MongoDB');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Possible issues:');
      console.log('   - MongoDB server is not accessible');
      console.log('   - IP not whitelisted (if using MongoDB Atlas)');
      console.log('   - Firewall blocking connection');
    }
    
    console.log('');
    console.log('📚 Need help? Check DEPLOYMENT.md for setup instructions');
    process.exit(1);
  });

