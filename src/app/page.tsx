'use client';

import React, { useState, useEffect } from 'react';
import {
  HeroSection,
  FeaturesSection,
  CategoriesSection,
  FeaturedProductsSection,
  NewsletterSection
} from '@/components/sections';
import { useCategories, useProducts, seedDatabase } from '@/hooks/useApi';
import { LoadingSpinner, LoadingScreen, Button } from '@/components/ui';
import Link from 'next/link';

// داده‌های بخش قهرمان
const heroData = {
  title: "ابزارهای حرفه‌ای برای",
  subtitle: "هر پروژه‌ای",
  description: "مجموعه‌ای از ابزارها و تجهیزات باکیفیت ما را کشف کنید. از ابزارهای برقی تا دستی، همه چیز مورد نیاز برای انجام کار را داریم.",
  primaryButtonText: "خرید کنید",
  secondaryButtonText: "مشاهده دسته‌بندی‌ها",
  imageSrc: "https://picsum.photos/600/600?random=1",
  imageAlt: "ابزارهای حرفه‌ای",
  discountBadge: "-۳۰٪ تخفیف",
  freeShippingBadge: "ارسال رایگان",
  onPrimaryClick: () => console.log('خرید کلیک شد'),
  onSecondaryClick: () => console.log('دسته‌بندی‌ها کلیک شد'),
};

// داده‌های بخش ویژگی‌ها
const featuresData = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "ارسال رایگان",
    description: "ارسال رایگان برای سفارشات بالای ۵۰ دلار"
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "ضمانت کیفیت",
    description: "سیاست بازگشت ۳۰ روزه برای همه اقلام"
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "ارسال سریع",
    description: "ارسال همان روز در دسترس است"
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
      </svg>
    ),
    title: "پشتیبانی ۲۴/۷",
    description: "پشتیبانی مشتریان در تمام ساعات"
  }
];

// داده‌های بخش خبرنامه
const newsletterData = {
  title: "به‌روز بمانید",
  description: "در خبرنامه ما عضو شوید و اولین کسی باشید که از محصولات جدید، پیشنهادات انحصاری و تخفیف‌های ویژه مطلع می‌شوید.",
  placeholder: "آدرس ایمیل خود را وارد کنید",
  buttonText: "عضویت",
  // onSubmit removed to use default API call
};

// Main Homepage Component
const HomePage: React.FC = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Fetch categories and products from API
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories({ limit: 9 });
  const { products, loading: productsLoading, error: productsError } = useProducts({
    featured: true,
    limit: 8
  });

  // Check if database needs seeding
  useEffect(() => {
    const checkAndSeedDatabase = async () => {
      if (categories.length === 0 && !categoriesLoading && !categoriesError) {
        setSeeding(true);
        try {
          await seedDatabase();
          setIsSeeded(true);
          // Reload the page to fetch new data
          window.location.reload();
        } catch (error) {
          console.error('Failed to seed database:', error);
        } finally {
          setSeeding(false);
        }
      }
    };

    checkAndSeedDatabase();
  }, [categories.length, categoriesLoading, categoriesError]);

  // Show loading spinner while seeding
  if (seeding) {
    return <LoadingScreen message="در حال بارگذاری داده‌ها..." variant="light" />;
  }

  // Show loading spinner while fetching data
  if (categoriesLoading || productsLoading) {
    return <LoadingScreen message="در حال بارگذاری..." variant="light" />;
  }

  // Show error if there's an issue
  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-800 mb-4">
            {categoriesError || productsError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection {...heroData} />
      <FeaturesSection features={featuresData} />
      <CategoriesSection
        categories={categories.map(cat => ({
          name: cat.name,
          image: cat.image,
          count: `${cat.productCount}+ محصول`,
          href: `/categories/${cat.slug}`
        }))}
        title="خرید بر اساس دسته‌بندی"
        description="طیف گسترده‌ای از دسته‌بندی‌های ابزار را کاوش کنید تا دقیقاً آنچه برای پروژه خود نیاز دارید را پیدا کنید"
        loading={categoriesLoading}
      />

      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Background with gradient and patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 sm:mb-6">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-blue-300 font-medium text-sm sm:text-base">قابلیت‌های پیشرفته</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
              جستجو و فیلتر
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                هوشمند
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
              با سیستم فیلتر پیشرفته ما، دقیقاً آنچه که می‌خواهید را پیدا کنید.
              تجربه خرید شخصی‌سازی شده با فیلترهای هوشمند
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Price Filter Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">فیلتر قیمت</h3>
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">جستجو بر اساس محدوده قیمت دلخواه شما</p>
                </div>
              </div>
            </div>

            {/* Rating Filter Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">فیلتر امتیاز</h3>
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">محصولات با بالاترین امتیاز مشتریان</p>
                </div>
              </div>
            </div>

            {/* Brand Filter Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">فیلتر برند</h3>
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">جستجو بر اساس برند مورد علاقه شما</p>
                </div>
              </div>
            </div>

            {/* Sorting Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">مرتب‌سازی</h3>
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">مرتب‌سازی بر اساس معیارهای مختلف</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">۵۰+</div>
              <div className="text-blue-200 text-xs sm:text-base">محصول متنوع</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">۹</div>
              <div className="text-blue-200 text-xs sm:text-base">دسته‌بندی مختلف</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">۱۰+</div>
              <div className="text-blue-200 text-xs sm:text-base">برند معتبر</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center px-4">
            <Link href="/products">
              <Button
                size="lg"
                className="group relative inline-flex items-center px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  شروع جستجو و فیلتر پیشرفته
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Button>
            </Link>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-blue-200">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm">فیلترهای هوشمند</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm">جستجوی سریع</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm">رابط کاربری مدرن</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection {...newsletterData} />
    </div>
  );
};

export default HomePage;