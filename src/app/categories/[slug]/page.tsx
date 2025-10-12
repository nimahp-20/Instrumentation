'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { LoadingScreen, Button } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';

interface Category {
  _id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  image: string;
  icon?: string;
  isActive: boolean;
  productCount: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  discount?: number;
  stock: number;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem: addToCart } = useCart();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category details
        const categoryResponse = await fetch(`/api/categories/${params.slug}`);
        const categoryData = await categoryResponse.json();

        if (!categoryData.success) {
          setError(categoryData.error || 'دسته‌بندی یافت نشد');
          setLoading(false);
          return;
        }

        setCategory(categoryData.data);

        // Fetch products in this category
        const productsResponse = await fetch(
          `/api/products?category=${params.slug}&sort=${sortBy}&order=${sortOrder}`
        );
        const productsData = await productsResponse.json();

        if (productsData.success) {
          setProducts(productsData.products || productsData.data || []);
        }
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCategoryAndProducts();
    }
  }, [params.slug, sortBy, sortOrder]);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p._id === productId);
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
        brand: '',
      });
    }
  };

  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  if (loading) {
    return <LoadingScreen message="در حال بارگذاری دسته‌بندی..." variant="light" />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-800 mb-4">{error || 'دسته‌بندی یافت نشد'}</p>
          <Link href="/products">
            <Button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              بازگشت به محصولات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">خانه</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">محصولات</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                {category.icon && (
                  <span className="text-4xl sm:text-5xl ml-4">{category.icon}</span>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{category.name}</h1>
              </div>
              <p className="text-lg sm:text-xl text-blue-100 mb-6 leading-relaxed">
                {category.description}
              </p>
              <div className="flex items-center space-x-4 space-x-reverse text-blue-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>{category.productCount} محصول</span>
                </div>
              </div>
            </div>
            {category.image && (
              <div className="hidden md:block">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Sort Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {products.length} محصول یافت شد
            </h2>
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="text-sm text-gray-600">مرتب‌سازی:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">جدیدترین</option>
                <option value="price">قیمت</option>
                <option value="rating">امتیاز</option>
                <option value="name">نام</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={sortOrder === 'asc' ? 'صعودی' : 'نزولی'}
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    sortOrder === 'desc' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <FeaturedProductsSection
            products={products.map(product => ({
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-600 mb-6">در حال حاضر محصولی در این دسته‌بندی موجود نیست.</p>
            <Link href="/products">
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                مشاهده همه محصولات
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
