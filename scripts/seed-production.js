const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    for (const line of envLines) {
      if (line.startsWith('MONGODB_URI=')) {
        MONGODB_URI = line.split('=')[1];
        break;
      }
    }
  } catch (error) {
    console.error('❌ Could not read .env.local file:', error.message);
    process.exit(1);
  }
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables or .env.local');
  console.log('Please make sure your .env.local file contains:');
  console.log('MONGODB_URI=mongodb+srv://your-connection-string');
  process.exit(1);
}

// Simple schemas for seeding
const categorySchema = new mongoose.Schema({
  name: String,
  nameEn: String,
  slug: String,
  description: String,
  descriptionEn: String,
  image: String,
  icon: String,
  sortOrder: Number,
  productCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
  name: String,
  nameEn: String,
  slug: String,
  description: String,
  descriptionEn: String,
  shortDescription: String,
  shortDescriptionEn: String,
  category: mongoose.Schema.Types.ObjectId,
  brand: String,
  sku: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [String],
  thumbnail: String,
  rating: Number,
  reviewCount: Number,
  stock: Number,
  minStock: Number,
  specifications: mongoose.Schema.Types.Mixed,
  features: [String],
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  sortOrder: Number
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// Categories data
const categoriesData = [
  {
    name: "ابزارهای برقی",
    nameEn: "Power Tools",
    slug: "power-tools",
    description: "ابزارهای برقی حرفه‌ای برای پروژه‌های ساختمانی و تعمیراتی",
    descriptionEn: "Professional power tools for construction and repair projects",
    image: "https://picsum.photos/400/300?random=10",
    icon: "⚡",
    sortOrder: 1
  },
  {
    name: "ابزارهای دستی",
    nameEn: "Hand Tools",
    slug: "hand-tools",
    description: "ابزارهای دستی باکیفیت برای کارهای دقیق و حرفه‌ای",
    descriptionEn: "High-quality hand tools for precise and professional work",
    image: "https://picsum.photos/400/300?random=11",
    icon: "🔧",
    sortOrder: 2
  },
  {
    name: "تجهیزات ایمنی",
    nameEn: "Safety Equipment",
    slug: "safety-equipment",
    description: "تجهیزات ایمنی و محافظتی برای محیط کار",
    descriptionEn: "Safety and protective equipment for work environments",
    image: "https://picsum.photos/400/300?random=12",
    icon: "🛡️",
    sortOrder: 3
  },
  {
    name: "ابزارهای خودرویی",
    nameEn: "Automotive Tools",
    slug: "automotive-tools",
    description: "ابزارهای تخصصی برای تعمیر و نگهداری خودرو",
    descriptionEn: "Specialized tools for vehicle repair and maintenance",
    image: "https://picsum.photos/400/300?random=13",
    icon: "🚗",
    sortOrder: 4
  },
  {
    name: "ابزارهای باغبانی",
    nameEn: "Garden Tools",
    slug: "garden-tools",
    description: "ابزارهای باغبانی و کشاورزی برای فضای سبز",
    descriptionEn: "Garden and agricultural tools for green spaces",
    image: "https://picsum.photos/400/300?random=14",
    icon: "🌱",
    sortOrder: 5
  },
  {
    name: "ابزارهای برق",
    nameEn: "Electrical Tools",
    slug: "electrical-tools",
    description: "ابزارهای تخصصی برق و الکترونیک",
    descriptionEn: "Specialized electrical and electronic tools",
    image: "https://picsum.photos/400/300?random=15",
    icon: "⚡",
    sortOrder: 6
  },
  {
    name: "ابزارهای نجاری",
    nameEn: "Woodworking Tools",
    slug: "woodworking-tools",
    description: "ابزارهای تخصصی نجاری و کار با چوب",
    descriptionEn: "Specialized woodworking and carpentry tools",
    image: "https://picsum.photos/400/300?random=16",
    icon: "🪵",
    sortOrder: 7
  },
  {
    name: "ابزارهای جوشکاری",
    nameEn: "Welding Tools",
    slug: "welding-tools",
    description: "ابزارهای جوشکاری و فلزکاری",
    descriptionEn: "Welding and metalworking tools",
    image: "https://picsum.photos/400/300?random=17",
    icon: "🔥",
    sortOrder: 8
  },
  {
    name: "ابزارهای اندازه‌گیری",
    nameEn: "Measuring Tools",
    slug: "measuring-tools",
    description: "ابزارهای دقیق اندازه‌گیری و کنترل کیفیت",
    descriptionEn: "Precise measuring tools and quality control equipment",
    image: "https://picsum.photos/400/300?random=18",
    icon: "📏",
    sortOrder: 9
  }
];

async function seedProduction() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('🌱 Creating categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories`);

    console.log('🛠️ Creating products...');
    const brands = ["Bosch", "DeWalt", "Stanley", "Milwaukee", "3M", "Makita", "Ryobi"];
    const products = [];

    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const basePrice = Math.floor(Math.random() * 8000000) + 2000000; // 2M-10M Toman
      const hasDiscount = Math.random() > 0.6;
      let price = basePrice;
      let originalPrice = null;

      if (hasDiscount) {
        const discountPercent = Math.floor(Math.random() * 30) + 10;
        originalPrice = Math.round(basePrice / (1 - discountPercent / 100));
      }

      const product = {
        name: `${category.name} ${i + 1}`,
        nameEn: `${category.nameEn} ${i + 1}`,
        slug: `${category.slug}-${i + 1}`,
        description: `توضیحات کامل برای ${category.name} ${i + 1} با کیفیت بالا و کارایی عالی`,
        descriptionEn: `Complete description for ${category.nameEn} ${i + 1} with high quality and excellent performance`,
        shortDescription: `توضیحات کوتاه ${category.name} ${i + 1}`,
        shortDescriptionEn: `Short description for ${category.nameEn} ${i + 1}`,
        category: category._id,
        brand: brands[Math.floor(Math.random() * brands.length)],
        sku: `${category.slug.toUpperCase().substring(0, 3)}-${String(i + 1).padStart(3, '0')}`,
        price: price,
        originalPrice: originalPrice,
        discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null,
        images: [`https://picsum.photos/400/400?random=${20 + i}`],
        thumbnail: `https://picsum.photos/400/400?random=${20 + i}`,
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        stock: Math.floor(Math.random() * 50) + 5,
        minStock: 5,
        specifications: {
          "وزن": `${Math.floor(Math.random() * 5) + 1} کیلوگرم`,
          "ابعاد": `${Math.floor(Math.random() * 50) + 10} × ${Math.floor(Math.random() * 30) + 5} × ${Math.floor(Math.random() * 20) + 3} سانتی‌متر`,
          "جنس": ["فولاد", "آلومینیوم", "پلاستیک", "چوب"][Math.floor(Math.random() * 4)],
          "رنگ": ["سیاه", "قرمز", "زرد", "آبی", "سبز"][Math.floor(Math.random() * 5)],
          "گارانتی": `${Math.floor(Math.random() * 3) + 1} سال`
        },
        features: ["کیفیت بالا", "دوام طولانی", "استاندارد بین‌المللی", "ضد زنگ", "سبک وزن"],
        tags: [category.name.toLowerCase().split(' ')[0], "حرفه‌ای", "با کیفیت"],
        isActive: true,
        isFeatured: Math.random() > 0.7,
        isNew: Math.random() > 0.8,
        isOnSale: !!originalPrice,
        sortOrder: i
      };

      products.push(product);
    }

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    // Update category product counts
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
    }

    console.log('🎉 Production database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);

  } catch (error) {
    console.error('❌ Error seeding production database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the seeding
seedProduction();
