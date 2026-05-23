import mongoose from 'mongoose';
import { loadEnvFiles } from './load-env';
import connectDB from './mongodb';
import { User } from './models/User';
import { Log } from './models/Log';
import { NewsletterUser } from './models/NewsletterUser';
import { Category, Product } from './models';
import {
  categoriesData,
  generateFeatures,
  generatePrice,
  generateRating,
  generateSKU,
  generateSpecifications,
  generateStock,
  generateTags,
} from './seed-products';

loadEnvFiles();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'مدیر';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'ابزارکده';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '09123456789';

const PRODUCT_COUNT = Number(process.env.SEED_PRODUCT_COUNT || 50);

async function seedAdminUser(): Promise<void> {
  console.log('👤 Seeding admin user (single account)...');

  await User.deleteMany({});
  console.log('   Cleared users collection');

  await User.create({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    firstName: ADMIN_FIRST_NAME,
    lastName: ADMIN_LAST_NAME,
    phone: ADMIN_PHONE,
    role: 'admin',
    isActive: true,
    emailVerified: true,
  });

  console.log(`   ✅ Admin: ${ADMIN_EMAIL}`);
}

async function seedCatalog(): Promise<{ categories: number; products: number }> {
  console.log('📦 Seeding categories and products...');

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('   Cleared products & categories');

  const categories = await Category.insertMany(categoriesData);
  console.log(`   ✅ ${categories.length} categories`);

  const productsToCreate = [];

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priceData = generatePrice();
    const ratingData = generateRating();

    productsToCreate.push({
      name: `${category.name} ${i + 1}`,
      nameEn: `${category.nameEn} ${i + 1}`,
      slug: `${category.slug}-${i + 1}`,
      description: `توضیحات کامل برای ${category.name} ${i + 1} با کیفیت بالا و کارایی عالی`,
      descriptionEn: `Complete description for ${category.nameEn} ${i + 1} with high quality and excellent performance`,
      shortDescription: `توضیحات کوتاه ${category.name} ${i + 1}`,
      shortDescriptionEn: `Short description for ${category.nameEn} ${i + 1}`,
      category: category._id,
      brand: ['Bosch', 'DeWalt', 'Stanley', 'Milwaukee', '3M', 'Makita', 'Ryobi'][
        Math.floor(Math.random() * 7)
      ],
      sku: generateSKU(category.slug.toUpperCase().slice(0, 3), i + 1),
      ...priceData,
      images: [`https://picsum.photos/400/400?random=${20 + i}`],
      thumbnail: `https://picsum.photos/400/400?random=${20 + i}`,
      ...ratingData,
      stock: generateStock(),
      minStock: 5,
      specifications: generateSpecifications(),
      features: generateFeatures(),
      tags: generateTags(category.name),
      isActive: true,
      isFeatured: Math.random() > 0.7,
      isNewProduct: Math.random() > 0.8,
      isOnSale: Boolean(priceData.originalPrice),
      sortOrder: i,
    });
  }

  const products = await Product.insertMany(productsToCreate);
  console.log(`   ✅ ${products.length} products`);

  for (const category of categories) {
    const productCount = await Product.countDocuments({ category: category._id });
    await Category.findByIdAndUpdate(category._id, { productCount });
  }

  return { categories: categories.length, products: products.length };
}

async function ensureCollections(): Promise<void> {
  console.log('📇 Ensuring collections & indexes...');
  await Promise.all([
    Category.init(),
    Product.init(),
    User.init(),
    Log.init(),
    NewsletterUser.init(),
  ]);

  const logCount = await Log.countDocuments();
  if (logCount === 0) {
    await Log.create({
      level: 'info',
      message: 'Database seeded (tools)',
      category: 'system',
      service: 'seed-all',
      severity: 1,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.0.0',
      timestamp: new Date(),
      tags: ['seed', 'bootstrap'],
    });
    console.log('   ✅ logs (bootstrap entry)');
  } else {
    console.log(`   ✅ logs (${logCount} existing)`);
  }

  const newsletterCount = await NewsletterUser.countDocuments();
  console.log(`   ✅ newsletterusers (${newsletterCount} subscribers)`);
  console.log('   ✅ users, categories, products indexes');
}

export async function seedAll(): Promise<void> {
  await connectDB();
  const dbName = mongoose.connection.name;
  console.log(`🌱 Seeding database "${dbName}"...\n`);

  await ensureCollections();
  await seedAdminUser();
  const catalog = await seedCatalog();

  console.log('\n🎉 Done!');
  console.log(`   Users (admin): 1`);
  console.log(`   Categories: ${catalog.categories}`);
  console.log(`   Products: ${catalog.products}`);
  console.log(`   Collections: logs, newsletterusers (ready)`);
  console.log(`\n🔐 Admin login: /admin/login`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: (ADMIN_PASSWORD in .env.local)`);
}

if (require.main === module) {
  seedAll()
    .then(async () => {
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Seed failed:', err);
      await mongoose.connection.close().catch(() => undefined);
      process.exit(1);
    });
}

export default seedAll;
