const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('🚀 Production Database Fix Script');
console.log('================================');

// Step 1: Load MongoDB URI
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      for (const line of envLines) {
        if (line.startsWith('MONGODB_URI=')) {
          MONGODB_URI = line.split('=')[1];
          break;
        }
      }
    }
  } catch (error) {
    console.log('⚠️  Could not read .env.local file');
  }
}

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI not found');
  console.log('');
  console.log('📋 Please follow these steps:');
  console.log('');
  console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
  console.log('2. Click "Connect" on your cluster');
  console.log('3. Choose "Connect your application"');
  console.log('4. Copy the connection string');
  console.log('5. Create .env.local file in your project root with:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  console.log('');
  console.log('6. Replace <password> with your actual password');
  console.log('7. Replace <dbname> with your database name (probably "tools")');
  console.log('');
  console.log('Example:');
  console.log('MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/tools?retryWrites=true&w=majority');
  console.log('');
  process.exit(1);
}

console.log('✅ MongoDB URI found');
console.log('🔌 Connecting to MongoDB Atlas...');

// Step 2: Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!');
  console.log('🎉 Your production database is working!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Your database connection is working');
  console.log('2. You need to seed the database with products');
  console.log('3. Run: npm run seed-production');
  console.log('4. Check your Vercel deployment status');
  console.log('');
  console.log('🔍 To check your Vercel deployment:');
  console.log('- Go to: https://vercel.com/dashboard');
  console.log('- Select your project: instrumentation');
  console.log('- Check the Deployments tab for any failed builds');
  console.log('');
  console.log('🌐 To test your site after seeding:');
  console.log('- Visit: https://instrumentation-zisw.vercel.app');
  console.log('- Check: https://instrumentation-zisw.vercel.app/api/health');
  console.log('- Check: https://instrumentation-zisw.vercel.app/api/products');
  console.log('');
})
.catch((error) => {
  console.log('❌ Failed to connect to MongoDB Atlas');
  console.log('');
  console.log('🔍 Error details:', error.message);
  console.log('');
  console.log('📋 Possible solutions:');
  console.log('');
  console.log('1. Check your MongoDB Atlas IP whitelist:');
  console.log('   - Go to Network Access in Atlas dashboard');
  console.log('   - Add IP: 0.0.0.0/0 (Allow access from anywhere)');
  console.log('   - Wait 1-2 minutes for changes to take effect');
  console.log('');
  console.log('2. Verify your connection string:');
  console.log('   - Make sure password is correct');
  console.log('   - Make sure database name is correct');
  console.log('   - Make sure cluster is running');
  console.log('');
  console.log('3. Check your database user:');
  console.log('   - Go to Database Access in Atlas');
  console.log('   - Make sure user exists and has read/write permissions');
  console.log('');
})
.finally(() => {
  mongoose.connection.close();
  console.log('🔌 Disconnected from MongoDB Atlas');
});
