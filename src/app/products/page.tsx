'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFilter, ProductFilters } from '@/components/filters/ProductFilter';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { useProducts, useCategories } from '@/hooks/useApi';
import { LoadingSpinner, LoadingScreen } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';

export default function ProductsPage() {
  const router = useRouter();
  const { addItem: addToCart } = useCart();
  
  const [filters, setFilters] = useState<ProductFilters>({
    sort: 'createdAt',
    order: 'desc'
  });

  // Fetch categories for filter
  const { categories } = useCategories();

  // Fetch products with filters
  const { products, loading, error, pagination } = useProducts({
    ...filters,
    limit: 12
  });

  // Extract unique brands from products
  const brands = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    const brandSet = new Set<string>();
    products.forEach(product => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      sort: 'createdAt',
      order: 'desc'
    });
  };

  const handleAddToCart = (productId: string) => {
    const product = products?.find(p => p._id === productId);
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        stock: product.stock,
        category: typeof product.category === 'string' ? product.category : product.category?.name || '',
        brand: product.brand,
      });
    }
  };

  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  if (loading) {
    return <LoadingScreen message="در حال بارگذاری محصولات..." variant="light" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-800 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">محصولات</h1>
            <p className="text-gray-600">
              {pagination?.totalCount ? `${pagination.totalCount} محصول یافت شد` : 'در حال جستجو...'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">فیلترها</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    پاک کردن
                  </button>
                </div>
                <ProductFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  brands={brands}
                  loading={false}
                />
              </div>
            </div>
          </div>

          {/* Simple Products Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    نمایش {products?.length || 0} محصول از {pagination?.totalCount || 0}
                  </h2>
                  <div className="text-sm text-gray-600">
                    مرتب‌سازی: {filters.sort === 'createdAt' ? 'جدیدترین' : 
                     filters.sort === 'price' ? 'قیمت' :
                     filters.sort === 'rating' ? 'امتیاز' : 'نام'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <FeaturedProductsSection
                  products={(products || []).map(product => ({
                    id: product._id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    images: product.images,
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                    discount: product.discount,
                    stock: product.stock
                  }))}
                  title=""
                  description=""
                  viewAllText=""
                  onAddToCart={handleAddToCart}
                  onViewProduct={handleViewProduct}
                  loading={false}
                />
              </div>
            </div>

            {/* Simple Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    قبلی
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700">
                    صفحه {pagination.currentPage} از {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
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
