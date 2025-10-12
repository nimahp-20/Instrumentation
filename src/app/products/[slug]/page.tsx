'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Badge, LoadingSpinner, LoadingScreen } from '@/components/ui';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getWhatsAppUrl, getWhatsAppShareUrl } from '@/config/contact';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  discount?: number;
  category: {
    name: string;
    slug: string;
  };
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
  warranty: string;
  color?: string;
  material?: string;
  reviews?: Array<{
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
          // Fetch related products
          const relatedResponse = await fetch(`/api/products?category=${data.product.category.slug}&limit=4&exclude=${data.product._id}`);
          const relatedData = await relatedResponse.json();
          if (relatedData.success) {
            setRelatedProducts(relatedData.products);
          }
        } else {
          setError(data.message || 'محصول یافت نشد');
        }
      } catch (err) {
        setError('خطا در بارگذاری محصول');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      stock: product.stock,
      category: product.category.name,
      brand: product.brand,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        stock: product.stock,
        category: product.category.name,
        brand: product.brand,
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!product) return;

    const currentUrl = window.location.href;
    const message = `سلام! این محصول را ببینید:

📦 *${product.name}*
💰 قیمت: ${formatPrice(product.price)} تومان
${product.originalPrice && product.originalPrice > product.price ? `🏷️ قیمت اصلی: ${formatPrice(product.originalPrice)} تومان (${calculateDiscount(product.originalPrice, product.price)}% تخفیف)` : ''}
⭐ امتیاز: ${product.rating}/5 (${product.reviewCount} نظر)
${product.stock > 0 ? '✅ موجود در انبار' : '❌ ناموجود'}

🔗 لینک محصول: ${currentUrl}

می‌خواهم اطلاعات بیشتری درباره این محصول بگیرم.`;

    const whatsappUrl = getWhatsAppShareUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const handleShareToContact = () => {
    if (!product) return;

    const currentUrl = window.location.href;
    const message = `سلام، من علاقه‌مند به این محصول هستم:

📦 *${product.name}*
💰 قیمت: ${formatPrice(product.price)} تومان
🔗 لینک: ${currentUrl}

لطفاً اطلاعات بیشتری در مورد این محصول به من بدهید.`;

    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (loading) {
    return <LoadingScreen message="در حال بارگذاری محصول..." variant="light" />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-800 mb-4">{error || 'محصول یافت نشد'}</p>
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
            <Link href="/" className="text-gray-700 hover:text-black font-medium cursor-pointer transition-colors">خانه</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="text-gray-700 hover:text-black font-medium cursor-pointer transition-colors">محصولات</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/categories/${product.category.slug}`} className="text-gray-700 hover:text-black font-medium cursor-pointer transition-colors">{product.category.name}</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${selectedImageIndex === index
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">({product.reviewCount} نظر)</span>
                </div>
              </div>
              <p className="text-gray-800 font-medium">{product.brand}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)} تومان</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-600 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                  <Badge className="bg-red-100 text-red-600">
                    {calculateDiscount(product.originalPrice, product.price)}% تخفیف
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">موجود در انبار ({product.stock} عدد)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">ناموجود</span>
                </>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-700 font-semibold">کد محصول</p>
                <p className="font-bold text-gray-900">{product.sku}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 font-semibold">دسته‌بندی</p>
                <Link href={`/categories/${product.category.slug}`} className="font-bold text-blue-600 hover:text-black cursor-pointer transition-colors">
                  {product.category.name}
                </Link>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <label className="text-base font-bold text-gray-900">تعداد:</label>
                <div className="flex items-center border-2 border-gray-400 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-900 font-bold text-lg hover:text-white hover:bg-black transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 border-l-2 border-r-2 border-gray-400 font-bold text-gray-900 text-lg min-w-[60px] text-center select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-gray-900 font-bold text-lg hover:text-white hover:bg-black transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {product.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
                </Button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    className={`px-4 py-3 border-2 transition-all duration-200 cursor-pointer font-bold ${isInWishlist(product._id)
                        ? 'border-red-600 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-700'
                        : 'border-red-500 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-700'
                      }`}
                  >
                    <svg className="w-5 h-5 ml-2" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="hidden sm:inline">{isInWishlist(product._id) ? 'حذف' : 'علاقه‌مندی'}</span>
                  </Button>

                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="px-4 py-3 border-2 border-green-600 text-green-800 hover:bg-green-600 hover:text-white hover:border-green-700 transition-all duration-200 cursor-pointer font-bold"
                  >
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span className="hidden sm:inline">اشتراک</span>
                  </Button>
                </div>

                {/* Contact via WhatsApp */}
                <Button
                  onClick={handleShareToContact}
                  variant="outline"
                  className="w-full px-4 py-3 border-2 border-green-600 bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:border-green-700 transition-all duration-200 cursor-pointer font-bold"
                >
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  تماس با ما در واتساپ برای اطلاعات بیشتر
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">ویژگی‌های کلیدی</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse">
                {[
                  { id: 'description', label: 'توضیحات', icon: '📝' },
                  { id: 'specifications', label: 'مشخصات فنی', icon: '⚙️' },
                  { id: 'reviews', label: `نظرات (${product.reviewCount})`, icon: '⭐' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-700 hover:text-black hover:border-gray-400 hover:bg-gray-100'
                      }`}
                  >
                    <span className="ml-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-bold text-gray-900">{key}</span>
                      <span className="text-gray-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-semibold">{review.user[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.user}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-700 font-medium">هنوز نظری برای این محصول ثبت نشده است.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <FeaturedProductsSection
              products={relatedProducts.map(product => ({
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
              title="محصولات مرتبط"
              description="محصولات مشابه که ممکن است برای شما جالب باشد"
              viewAllText=""
              onAddToCart={(productId) => {
                const relatedProduct = relatedProducts.find(p => p._id === productId);
                if (relatedProduct) {
                  addToCart({
                    id: relatedProduct._id,
                    name: relatedProduct.name,
                    slug: relatedProduct.slug,
                    price: relatedProduct.price,
                    originalPrice: relatedProduct.originalPrice,
                    images: relatedProduct.images,
                    stock: relatedProduct.stock,
                    category: relatedProduct.category?.name || '',
                    brand: relatedProduct.brand,
                  });
                }
              }}
              onViewProduct={(slug) => router.push(`/products/${slug}`)}
            />
          </div>
        )}

        {/* Image Lightbox */}
        <ImageLightbox
          images={product.images}
          currentIndex={selectedImageIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onNext={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
          onPrev={() => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
          productName={product.name}
        />
      </div>
    </div>
  );
}
