import { loadEnvFiles } from './load-env';
import connectDB from './mongodb';
import { User } from './models/User';

loadEnvFiles();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'مدیر';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'سیستم';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '09123456789';

async function seedAdmin() {
  await connectDB();
  console.log('🌱 Seeding admin user...');
  console.log(`📧 Email: ${ADMIN_EMAIL}`);

  let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (user) {
    user.password = ADMIN_PASSWORD;
    user.role = 'admin';
    user.isActive = true;
    user.emailVerified = true;
    await user.save();
    console.log('✅ Admin user updated (password reset)');
  } else {
    user = await User.create({
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      phone: ADMIN_PHONE,
      role: 'admin',
      isActive: true,
      emailVerified: true,
    });
    console.log('✅ Admin user created');
  }

  console.log('🎉 Admin seed complete');
  console.log('🔗 Login at: /admin/login');
}

if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Admin seed failed:', err);
      process.exit(1);
    });
}

export default seedAdmin;
