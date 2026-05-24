'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProductFilter, ProductFilters } from '@/components/filters/ProductFilter';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { useCategory, useProducts, useCategories } from '@/hooks/useApi';
import { useCart } from '@/contexts/CartContext';

function sortLabel(sort: string | undefined) {
  switch (sort) {
    case 'price':
      return 'قیمت';
    case 'rating':
      return 'امتیاز';
    case 'popularity':
      return 'محبوبیت';
    case 'stock':
      return 'موجودی';
    case 'name':
      return 'نام';
    default:
      return 'جدیدترین';
  }
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem: addToCart } = useCart();

  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? '';

  const [filters, setFilters] = useState<ProductFilters>({
    category: slug,
    sort: 'createdAt',
    order: 'desc',
    page: 1,
  });

  useEffect(() => {
    if (slug) {
      setFilters((prev) => ({ ...prev, category: slug, page: 1 }));
    }
  }, [slug]);

  const { category, loading: categoryLoading, error: categoryError } = useCategory(slug);
  const { categories } = useCategories();

  const { products, loading: productsLoading, error: productsError, pagination } = useProducts({
    ...filters,
    category: slug,
    limit: 12,
  });

  const brands = useMemo(() => {
    if (!products?.length) return [];
    const brandSet = new Set<string>();
    products.forEach((product) => {
      if (product.brand) brandSet.add(product.brand);
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters({ ...newFilters, category: slug, page: newFilters.page ?? 1 });
  }, [slug]);

  const clearFilters = () => {
    setFilters({
      category: slug,
      sort: 'createdAt',
      order: 'desc',
      page: 1,
    });
  };

  const handleAddToCart = (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        stock: product.stock,
        category: category?.name || '',
        brand: product.brand,
      });
    }
  };

  const handleViewProduct = (productSlug: string) => {
    router.push(`/products/${productSlug}`);
  };

  const loading = categoryLoading || (productsLoading && (!products || products.length === 0));
  const error = categoryError || productsError;

  if (loading) {
    return (
      <div className="profile-shell min-h-[60vh] flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="text-center px-4">
          <div
            className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'rgb(224 242 254)', borderTopColor: 'var(--admin-primary)' }}
          />
          <p className="text-[var(--admin-muted)] font-medium">در حال بارگذاری دسته‌بندی...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="profile-shell min-h-[60vh] flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)] px-4 py-12">
        <div className="profile-card max-w-md w-full p-8 text-center">
          <div
            className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 shadow-md"
            style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
            aria-hidden
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--admin-text)] mb-2">دسته‌بندی یافت نشد</h2>
          <p className="text-[var(--admin-muted)] text-sm mb-6 leading-relaxed">
            {error || 'این دسته‌بندی وجود ندارد یا غیرفعال است.'}
          </p>
          <Link href="/products" className="profile-btn-primary inline-flex px-8 py-3 text-sm">
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    );
  }

  const totalCount = pagination?.totalCount ?? category.productCount ?? 0;
  const shown = products?.length ?? 0;
  const categoryImage = category.image || '/placeholder-product.jpg';

  return (
    <div className="profile-shell min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 space-y-6 sm:space-y-8">
        {/* مسیر */}
        <div className="profile-card px-4 sm:px-5 py-3.5">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--admin-muted)]" aria-label="مسیر صفحه">
            <Link href="/" className="hover:text-[var(--admin-primary)] transition-colors">
              خانه
            </Link>
            <span className="text-slate-300 px-0.5" aria-hidden>
              /
            </span>
            <Link href="/products" className="hover:text-[var(--admin-primary)] transition-colors">
              محصولات
            </Link>
            <span className="text-slate-300 px-0.5" aria-hidden>
              /
            </span>
            <span className="text-[var(--admin-text)] font-semibold">{category.name}</span>
          </nav>
        </div>

        {/* هدر دسته‌بندی */}
        <div className="profile-card overflow-hidden relative">
          <div
            className="h-32 sm:h-40 relative"
            style={{
              background:
                'linear-gradient(120deg, var(--admin-navy) 0%, var(--admin-navy-2) 45%, var(--admin-primary) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgb(15_23_42/0.15)_100%)]" />
            <div className="absolute bottom-4 end-6 text-white/90 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              فروشگاه ابزارکده
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-7 sm:pb-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div className="relative -mt-16 sm:-mt-[4.25rem] shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 ring-1 ring-sky-100/90">
                  {category.icon && !category.image ? (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl"
                      style={{
                        background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
                      }}
                      aria-hidden
                    >
                      {category.icon}
                    </div>
                  ) : (
                    <Image
                      src={categoryImage}
                      alt={category.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-right min-w-0 w-full">
                <p className="text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wide mb-1">
                  دسته‌بندی
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text)] mb-2 tracking-tight">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-[var(--admin-muted)] text-sm sm:text-base mb-4 leading-relaxed max-w-2xl sm:ms-0 mx-auto">
                    {category.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-sky-50 text-sky-900 border border-sky-200/80">
                    <svg className="w-4 h-4 shrink-0 text-[var(--admin-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {totalCount.toLocaleString('fa-IR')} محصول
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-violet-50 text-violet-900 border border-violet-200/80">
                    مرتب‌سازی: {sortLabel(filters.sort)}
                    {filters.order === 'asc' ? ' (صعودی)' : ' (نزولی)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* آمار خلاصه */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="profile-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-primary)]"
                style={{ background: 'rgb(224 242 254 / 0.9)' }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[var(--admin-muted)] mb-0.5">دستهٔ فعلی</p>
                <p className="text-base sm:text-lg font-bold text-[var(--admin-text)]">{category.name}</p>
              </div>
            </div>
          </div>
          <div className="profile-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-purple)]"
                style={{ background: 'rgb(243 232 255 / 0.9)' }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[var(--admin-muted)] mb-0.5">نمایش در این صفحه</p>
                <p className="text-base sm:text-lg font-bold text-[var(--admin-text)] tabular-nums">
                  {shown.toLocaleString('fa-IR')} از {totalCount.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="profile-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <h2 className="text-lg font-bold text-[var(--admin-text)]">فیلترها</h2>
                  <button type="button" onClick={clearFilters} className="profile-btn-danger-ghost text-xs px-3 py-2 shrink-0">
                    پاک کردن
                  </button>
                </div>
                <ProductFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  brands={brands}
                  loading={productsLoading}
                  hideCategorySelect
                />
              </div>

              {categories.length > 1 && (
                <div className="profile-card p-5 sm:p-6">
                  <h2 className="text-sm font-bold text-[var(--admin-text)] mb-3">سایر دسته‌ها</h2>
                  <ul className="space-y-1.5">
                    {categories
                      .filter((c) => c.slug !== slug)
                      .slice(0, 6)
                      .map((c) => (
                        <li key={c._id}>
                          <Link
                            href={`/categories/${c.slug}`}
                            className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-sm text-[var(--admin-muted)] hover:bg-slate-50 hover:text-[var(--admin-primary)] transition-colors"
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-xs tabular-nums shrink-0 text-slate-400">
                              {c.productCount.toLocaleString('fa-IR')}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <Link
                    href="/products"
                    className="mt-4 block text-center text-sm font-medium text-[var(--admin-primary)] hover:underline"
                  >
                    همهٔ محصولات
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="profile-card overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <h2 className="font-semibold text-slate-800">محصولات {category.name}</h2>
                <p className="text-xs text-[var(--admin-muted)] mt-0.5">
                  {shown > 0
                    ? `نمایش ${shown.toLocaleString('fa-IR')} از ${totalCount.toLocaleString('fa-IR')} · ${sortLabel(filters.sort)}${filters.order === 'asc' ? ' صعودی' : ' نزولی'}`
                    : 'محصولی با این فیلترها یافت نشد'}
                </p>
              </div>

              <div className={`p-4 sm:p-5 relative min-h-[12rem] ${productsLoading && shown > 0 ? 'opacity-60 pointer-events-none' : ''}`}>
                {shown > 0 ? (
                  <FeaturedProductsSection
                    layout="embedded"
                    productCardVariant="catalog"
                    products={(products || []).map((product) => ({
                      id: product._id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      images: product.images,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                      discount: product.discount,
                      stock: product.stock,
                    }))}
                    title=""
                    description=""
                    viewAllText=""
                    onAddToCart={handleAddToCart}
                    onViewProduct={handleViewProduct}
                    loading={false}
                  />
                ) : (
                  <div className="py-12 sm:py-16 text-center">
                    <div
                      className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--admin-primary)] mb-4"
                      style={{ background: 'rgb(224 242 254 / 0.9)' }}
                      aria-hidden
                    >
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--admin-text)] mb-2">محصولی یافت نشد</h3>
                    <p className="text-sm text-[var(--admin-muted)] mb-6 max-w-sm mx-auto">
                      در این دسته با فیلترهای فعلی محصولی نیست. فیلترها را پاک کنید یا دستهٔ دیگری را ببینید.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button type="button" onClick={clearFilters} className="profile-btn-ghost px-5 py-2.5 text-sm">
                        پاک کردن فیلترها
                      </button>
                      <Link href="/products" className="profile-btn-primary px-5 py-2.5 text-sm">
                        همهٔ محصولات
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="profile-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[var(--admin-muted)]">
                  صفحه {pagination.currentPage.toLocaleString('fa-IR')} از {pagination.totalPages.toLocaleString('fa-IR')}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!pagination.hasPrevPage}
                    className="profile-btn-ghost px-4 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    قبلی
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!pagination.hasNextPage}
                    className="profile-btn-primary px-4 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
