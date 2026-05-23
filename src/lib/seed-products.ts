import mongoose from 'mongoose';
import { Category, Product } from './models';
import connectToDatabase from './mongodb';

// Persian and English category data
export const categoriesData = [
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

// Persian and English product data
const _productsData = [
  // Power Tools
  {
    name: "دریل برقی حرفه‌ای",
    nameEn: "Professional Electric Drill",
    slug: "professional-electric-drill",
    description: "دریل برقی قدرتمند با قابلیت تنظیم سرعت و گشتاور بالا",
    descriptionEn: "Powerful electric drill with adjustable speed and high torque",
    shortDescription: "دریل برقی حرفه‌ای با قابلیت‌های پیشرفته",
    shortDescriptionEn: "Professional electric drill with advanced features",
    brand: "Bosch",
    sku: "DRL-001",
    price: 3780000,
    originalPrice: 5460000,
    images: ["https://picsum.photos/400/400?random=20"],
    thumbnail: "https://picsum.photos/400/400?random=20",
    rating: 4.8,
    reviewCount: 156,
    stock: 25,
    features: ["قابلیت تنظیم سرعت", "گشتاور بالا", "باتری قابل شارژ"],
    tags: ["دریل", "برقی", "حرفه‌ای"],
    isFeatured: true,
    isOnSale: true
  },
  {
    name: "اره برقی پیشرفته",
    nameEn: "Advanced Circular Saw",
    slug: "advanced-circular-saw",
    description: "اره برقی با تیغه الماس و سیستم ایمنی پیشرفته",
    descriptionEn: "Circular saw with diamond blade and advanced safety system",
    shortDescription: "اره برقی با تیغه الماس و ایمنی بالا",
    shortDescriptionEn: "Circular saw with diamond blade and high safety",
    brand: "DeWalt",
    sku: "SAW-002",
    price: 8400000,
    originalPrice: 10500000,
    images: ["https://picsum.photos/400/400?random=21"],
    thumbnail: "https://picsum.photos/400/400?random=21",
    rating: 4.5,
    reviewCount: 78,
    stock: 8,
    features: ["تیغه الماس", "سیستم ایمنی", "قدرت بالا"],
    tags: ["اره", "برقی", "الماس"],
    isFeatured: true,
    isOnSale: true
  },
  // Hand Tools
  {
    name: "ست آچار سنگین",
    nameEn: "Heavy Duty Wrench Set",
    slug: "heavy-duty-wrench-set",
    description: "ست آچار کامل با کیفیت فولاد کروم وانادیوم",
    descriptionEn: "Complete wrench set with chrome vanadium steel quality",
    shortDescription: "ست آچار کامل با کیفیت بالا",
    shortDescriptionEn: "Complete wrench set with high quality",
    brand: "Stanley",
    sku: "WRN-003",
    price: 1932000,
    originalPrice: 2772000,
    images: ["https://picsum.photos/400/400?random=22"],
    thumbnail: "https://picsum.photos/400/400?random=22",
    rating: 4.6,
    reviewCount: 89,
    stock: 18,
    features: ["فولاد کروم وانادیوم", "ضد زنگ", "گارانتی مادام‌العمر"],
    tags: ["آچار", "ست", "فولاد"],
    isFeatured: true,
    isOnSale: true
  },
  {
    name: "چکش چندکاره",
    nameEn: "Multi-Purpose Hammer",
    slug: "multi-purpose-hammer",
    description: "چکش چندکاره با دسته چوبی و سر فولادی",
    descriptionEn: "Multi-purpose hammer with wooden handle and steel head",
    shortDescription: "چکش چندکاره با دسته چوبی",
    shortDescriptionEn: "Multi-purpose hammer with wooden handle",
    brand: "Estwing",
    sku: "HAM-004",
    price: 1512000,
    images: ["https://picsum.photos/400/400?random=23"],
    thumbnail: "https://picsum.photos/400/400?random=23",
    rating: 4.7,
    reviewCount: 134,
    stock: 35,
    features: ["دسته چوبی", "سر فولادی", "تعادل عالی"],
    tags: ["چکش", "چندکاره", "چوبی"],
    isFeatured: true
  },
  // Safety Equipment
  {
    name: "کلاه ایمنی حرفه‌ای",
    nameEn: "Professional Safety Helmet",
    slug: "professional-safety-helmet",
    description: "کلاه ایمنی با استاندارد ANSI و مقاوم در برابر ضربه",
    descriptionEn: "Safety helmet with ANSI standard and impact resistance",
    shortDescription: "کلاه ایمنی با استاندارد ANSI",
    shortDescriptionEn: "Safety helmet with ANSI standard",
    brand: "3M",
    sku: "HLM-005",
    price: 29.99,
    images: ["https://picsum.photos/400/400?random=24"],
    thumbnail: "https://picsum.photos/400/400?random=24",
    rating: 4.9,
    reviewCount: 203,
    stock: 42,
    features: ["استاندارد ANSI", "مقاوم در برابر ضربه", "تهویه مناسب"],
    tags: ["کلاه", "ایمنی", "ANSI"],
    isFeatured: true
  },
  {
    name: "دستکش ایمنی",
    nameEn: "Safety Gloves",
    slug: "safety-gloves",
    description: "دستکش ایمنی ضد برش با آستری نرم",
    descriptionEn: "Cut-resistant safety gloves with soft lining",
    shortDescription: "دستکش ایمنی ضد برش",
    shortDescriptionEn: "Cut-resistant safety gloves",
    brand: "Mechanix",
    sku: "GLV-006",
    price: 19.99,
    images: ["https://picsum.photos/400/400?random=25"],
    thumbnail: "https://picsum.photos/400/400?random=25",
    rating: 4.4,
    reviewCount: 67,
    stock: 28,
    features: ["ضد برش", "آستری نرم", "انعطاف بالا"],
    tags: ["دستکش", "ایمنی", "ضد برش"]
  },
  // Automotive Tools
  {
    name: "درایور ضربه‌ای بی‌سیم",
    nameEn: "Cordless Impact Driver",
    slug: "cordless-impact-driver",
    description: "درایور ضربه‌ای بی‌سیم با باتری لیتیوم یون",
    descriptionEn: "Cordless impact driver with lithium-ion battery",
    shortDescription: "درایور ضربه‌ای بی‌سیم",
    shortDescriptionEn: "Cordless impact driver",
    brand: "Milwaukee",
    sku: "IMP-007",
    price: 159.99,
    originalPrice: 199.99,
    images: ["https://picsum.photos/400/400?random=26"],
    thumbnail: "https://picsum.photos/400/400?random=26",
    rating: 4.7,
    reviewCount: 127,
    stock: 12,
    features: ["باتری لیتیوم یون", "قدرت بالا", "بدون سیم"],
    tags: ["درایور", "ضربه‌ای", "بی‌سیم"],
    isFeatured: true,
    isOnSale: true
  },
  {
    name: "کمربند ابزار چرمی",
    nameEn: "Leather Tool Belt",
    slug: "leather-tool-belt",
    description: "کمربند ابزار چرمی با جیب‌های متعدد",
    descriptionEn: "Leather tool belt with multiple pockets",
    shortDescription: "کمربند ابزار چرمی",
    shortDescriptionEn: "Leather tool belt",
    brand: "Craftsman",
    sku: "BLT-008",
    price: 49.99,
    images: ["https://picsum.photos/400/400?random=27"],
    thumbnail: "https://picsum.photos/400/400?random=27",
    rating: 4.4,
    reviewCount: 67,
    stock: 18,
    features: ["چرم طبیعی", "جیب‌های متعدد", "دوام بالا"],
    tags: ["کمربند", "ابزار", "چرم"]
  },
  // Garden Tools
  {
    name: "بیل باغبانی",
    nameEn: "Garden Spade",
    slug: "garden-spade",
    description: "بیل باغبانی با دسته چوبی و تیغه فولادی",
    descriptionEn: "Garden spade with wooden handle and steel blade",
    shortDescription: "بیل باغبانی با دسته چوبی",
    shortDescriptionEn: "Garden spade with wooden handle",
    brand: "Fiskars",
    sku: "SPD-009",
    price: 24.99,
    images: ["https://picsum.photos/400/400?random=28"],
    thumbnail: "https://picsum.photos/400/400?random=28",
    rating: 4.3,
    reviewCount: 45,
    stock: 22,
    features: ["دسته چوبی", "تیغه فولادی", "سبک وزن"],
    tags: ["بیل", "باغبانی", "چوبی"]
  },
  // Electrical Tools
  {
    name: "متر لیزری دیجیتال",
    nameEn: "Digital Laser Measure",
    slug: "digital-laser-measure",
    description: "متر لیزری دیجیتال با دقت بالا و صفحه نمایش LCD",
    descriptionEn: "Digital laser measure with high accuracy and LCD display",
    shortDescription: "متر لیزری دیجیتال",
    shortDescriptionEn: "Digital laser measure",
    brand: "Leica",
    sku: "LZM-010",
    price: 79.99,
    originalPrice: 99.99,
    images: ["https://picsum.photos/400/400?random=29"],
    thumbnail: "https://picsum.photos/400/400?random=29",
    rating: 4.6,
    reviewCount: 92,
    stock: 22,
    features: ["دقت بالا", "صفحه LCD", "حافظه داخلی"],
    tags: ["متر", "لیزری", "دیجیتال"],
    isFeatured: true,
    isOnSale: true
  }
];

// Function to generate random SKU
export function generateSKU(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

// Function to generate random specifications
export function generateSpecifications(): { [key: string]: string } {
  const specs = [
    { key: "وزن", value: `${Math.floor(Math.random() * 5) + 1} کیلوگرم` },
    { key: "ابعاد", value: `${Math.floor(Math.random() * 50) + 10} × ${Math.floor(Math.random() * 30) + 5} × ${Math.floor(Math.random() * 20) + 3} سانتی‌متر` },
    { key: "جنس", value: ["فولاد", "آلومینیوم", "پلاستیک", "چوب"][Math.floor(Math.random() * 4)] },
    { key: "رنگ", value: ["سیاه", "قرمز", "زرد", "آبی", "سبز"][Math.floor(Math.random() * 5)] },
    { key: "گارانتی", value: `${Math.floor(Math.random() * 3) + 1} سال` }
  ];
  
  const result: { [key: string]: string } = {};
  specs.forEach(spec => {
    result[spec.key] = spec.value;
  });
  return result;
}

// Function to generate random features
export function generateFeatures(): string[] {
  const allFeatures = [
    "کیفیت بالا",
    "دوام طولانی",
    "استاندارد بین‌المللی",
    "ضد زنگ",
    "سبک وزن",
    "قدرت بالا",
    "ایمنی بالا",
    "کاربری آسان",
    "قیمت مناسب",
    "گارانتی معتبر"
  ];
  
  const numFeatures = Math.floor(Math.random() * 4) + 3; // 3-6 features
  const shuffled = allFeatures.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFeatures);
}

// Function to generate random tags
export function generateTags(categoryName: string): string[] {
  const baseTags = categoryName.toLowerCase().split(' ')[0];
  const additionalTags = [
    "حرفه‌ای",
    "با کیفیت",
    "مقاوم",
    "کاربردی",
    "مدرن",
    "اصلی"
  ];
  
  const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
  const shuffled = additionalTags.sort(() => 0.5 - Math.random());
  return [baseTags, ...shuffled.slice(0, numTags - 1)];
}

// Function to generate random price in Toman
export function generatePrice(): { price: number; originalPrice?: number; discount?: number } {
  // Generate realistic Toman prices (much higher than USD)
  const basePrice = Math.floor(Math.random() * 8000000) + 2000000; // 2,000,000 - 10,000,000 Toman
  const hasDiscount = Math.random() > 0.6; // 40% chance of discount
  
  if (hasDiscount) {
    const discountPercent = Math.floor(Math.random() * 30) + 10; // 10-40% discount
    const originalPrice = Math.round(basePrice / (1 - discountPercent / 100));
    return {
      price: basePrice,
      originalPrice: originalPrice,
      discount: discountPercent
    };
  }
  
  return { price: basePrice };
}

// Function to generate random rating and reviews
export function generateRating(): { rating: number; reviewCount: number } {
  const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0
  const reviewCount = Math.floor(Math.random() * 200) + 10; // 10-210 reviews
  return { rating, reviewCount };
}

// Function to generate random stock
export function generateStock(): number {
  return Math.floor(Math.random() * 50) + 5; // 5-55 stock
}

// Main seed function
export async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products with random data
    const productsToCreate = [];
    
    for (let i = 0; i < 50; i++) {
      const categoryIndex = Math.floor(Math.random() * createdCategories.length);
      const category = createdCategories[categoryIndex];
      const categoryName = category.name;
      
      const priceData = generatePrice();
      const ratingData = generateRating();
      const stock = generateStock();
      
      const productData = {
        name: `${categoryName} ${i + 1}`,
        nameEn: `${category.nameEn} ${i + 1}`,
        slug: `${category.slug}-${i + 1}`,
        description: `توضیحات کامل برای ${categoryName} ${i + 1} با کیفیت بالا و کارایی عالی`,
        descriptionEn: `Complete description for ${category.nameEn} ${i + 1} with high quality and excellent performance`,
        shortDescription: `توضیحات کوتاه ${categoryName} ${i + 1}`,
        shortDescriptionEn: `Short description for ${category.nameEn} ${i + 1}`,
        category: category._id,
        brand: ["Bosch", "DeWalt", "Stanley", "Milwaukee", "3M", "Makita", "Ryobi"][Math.floor(Math.random() * 7)],
        sku: generateSKU(category.slug.toUpperCase().substring(0, 3), i + 1),
        ...priceData,
        images: [`https://picsum.photos/400/400?random=${20 + i}`],
        thumbnail: `https://picsum.photos/400/400?random=${20 + i}`,
        ...ratingData,
        stock,
        minStock: 5,
        specifications: generateSpecifications(),
        features: generateFeatures(),
        tags: generateTags(categoryName),
        isActive: true,
        isFeatured: Math.random() > 0.7, // 30% chance of being featured
        isNewProduct: Math.random() > 0.8, // 20% chance of being new
        isOnSale: priceData.originalPrice ? true : false,
        sortOrder: i
      };
      
      productsToCreate.push(productData);
    }

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Update category product counts
    for (const category of createdCategories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    
    return {
      categories: createdCategories.length,
      products: createdProducts.length
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log('✅ Seeding completed:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
