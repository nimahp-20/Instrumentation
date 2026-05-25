'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPriceRange, formatPersianNumber } from '@/lib/price-utils';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getWhatsAppUrl, getWhatsAppShareUrl } from '@/config/contact';
import type { Product as ApiProduct, Category as ApiCategory } from '@/hooks/useApi';

function getCategoryName(category: ApiCategory | string | undefined): string {
  if (!category || typeof category === 'string') return '';
  return category.name;
}

type ProductTab = 'description' | 'specifications' | 'reviews';

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
  const [activeTab, setActiveTab] = useState<ProductTab>('description');
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { addItem: addToCart } = useCart();
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
      } catch (_err) {
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

  const formatPrice = (price: number) => formatPersianNumber(price);

  const calculateDiscount = (original: number, current: number) =>
    Math.round(((original - current) / original) * 100);

  if (loading) {
    return (
      <div className="profile-shell min-h-[60vh] flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="text-center px-4">
          <div
            className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'rgb(224 242 254)', borderTopColor: 'var(--admin-primary)' }}
          />
          <p className="text-[var(--admin-muted)] font-medium">در حال بارگذاری محصول...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
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
          <h2 className="text-xl font-bold text-[var(--admin-text)] mb-2">خطا در بارگذاری</h2>
          <p className="text-[var(--admin-muted)] text-sm mb-6 leading-relaxed">{error || 'محصول یافت نشد'}</p>
          <Link href="/products" className="profile-btn-primary inline-flex items-center justify-center px-8 py-3 text-sm">
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    );
  }

  const priceInfo = formatPriceRange(product.price, product.originalPrice);

  return (
    <div className="profile-shell min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb */}
        <div className="profile-card px-4 py-3.5 sm:px-5">
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm" aria-label="مسیر">
            <Link href="/" className="text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors">
              خانه
            </Link>
            <span className="text-slate-300 px-0.5" aria-hidden>
              /
            </span>
            <Link href="/products" className="text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors">
              محصولات
            </Link>
            <span className="text-slate-300 px-0.5" aria-hidden>
              /
            </span>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors"
            >
              {product.category.name}
            </Link>
            <span className="text-slate-300 px-0.5" aria-hidden>
              /
            </span>
            <span className="text-[var(--admin-text)] font-semibold line-clamp-2">{product.name}</span>
          </nav>
        </div>

        {/* Hero — هم‌سبک هدر کاتالوگ */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              فروشگاه ابزارکده
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-7 sm:pb-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div className="relative -mt-16 sm:-mt-[4.25rem] shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 ring-1 ring-sky-100/90">
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-right min-w-0 w-full">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--admin-text)] mb-2 leading-snug tracking-tight">
                  {product.name}
                </h1>
                <p className="text-[var(--admin-muted)] text-sm sm:text-base mb-4">
                  <span className="font-medium text-[var(--admin-text)]">{product.brand}</span>
                  <span className="mx-2 text-slate-300">·</span>
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="text-[var(--admin-primary)] font-medium hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-amber-50 text-amber-950 border border-amber-200/80">
                    <span className="flex items-center gap-0.5" aria-label={`امتیاز ${product.rating}`}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 shrink-0 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                    <span className="text-slate-600 tabular-nums">({formatPersianNumber(product.reviewCount)} نظر)</span>
                  </span>
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-blue-50 text-blue-900 border border-blue-200/80">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      موجود ({formatPersianNumber(product.stock)} عدد)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-red-50 text-red-800 border border-red-200/80">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      ناموجود
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* گالری */}
          <div className="profile-card p-4 sm:p-5 space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-sky-100/90 shadow-[var(--admin-shadow)]">
              <Image
                src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                    selectedImageIndex === index
                      ? 'border-[var(--admin-primary)] shadow-md ring-1 ring-sky-200/80'
                      : 'border-slate-200 hover:border-sky-300 hover:shadow-sm'
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* خرید و اطلاعات */}
          <div className="profile-card p-5 sm:p-6 flex flex-col gap-5 sm:gap-6">
            <div>
              <p className="text-xs font-semibold text-[var(--admin-muted)] uppercase tracking-wide mb-2">قیمت</p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="text-2xl sm:text-3xl font-bold text-[var(--admin-text)] tabular-nums">{priceInfo.current}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 min-h-[1.5rem]">
                {priceInfo.original && (
                  <span className="text-sm text-[var(--admin-muted)] line-through tabular-nums">{priceInfo.original}</span>
                )}
                {priceInfo.discount && (
                  <span className="inline-flex items-center rounded-[8px] bg-red-50 text-red-700 border border-red-100/90 text-xs font-medium px-2 py-0.5">
                    {priceInfo.discount}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-[10px] border border-slate-200/90 bg-slate-50/80 px-3 py-3 text-center">
                <p className="text-xs text-[var(--admin-muted)] font-medium mb-1">کد محصول</p>
                <p className="font-bold text-[var(--admin-text)] text-sm sm:text-base">{product.sku}</p>
              </div>
              <div className="rounded-[10px] border border-slate-200/90 bg-slate-50/80 px-3 py-3 text-center">
                <p className="text-xs text-[var(--admin-muted)] font-medium mb-1">دسته‌بندی</p>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="font-bold text-[var(--admin-primary)] text-sm sm:text-base hover:underline"
                >
                  {product.category.name}
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-semibold text-[var(--admin-text)] shrink-0">تعداد</span>
              <div className="inline-flex items-center rounded-[10px] border border-slate-200 bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-lg font-bold text-[var(--admin-text)] hover:bg-slate-50 transition-colors"
                >
                  −
                </button>
                <span className="px-5 py-2.5 min-w-[3rem] text-center font-bold tabular-nums border-x border-slate-200 bg-slate-50/50">
                  {formatPersianNumber(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2.5 text-lg font-bold text-[var(--admin-text)] hover:bg-slate-50 transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="profile-btn-primary w-full inline-flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2.5 text-sm disabled:opacity-45 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                {product.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
              </button>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`profile-btn-danger-ghost min-h-[2.5rem] px-4 py-2 text-sm inline-flex items-center justify-center gap-2 ${
                    isInWishlist(product._id) ? 'ring-2 ring-red-200' : ''
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isInWishlist(product._id) ? 'حذف از علاقه‌مندی' : 'علاقه‌مندی'}
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="profile-btn-accent-ghost min-h-[2.5rem] px-4 py-2 text-sm inline-flex items-center justify-center gap-2 text-blue-800 border-blue-200 bg-blue-50/90 hover:bg-blue-100"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  اشتراک واتساپ
                </button>
              </div>

              <button
                type="button"
                onClick={handleShareToContact}
                className="profile-btn-accent-ghost w-full min-h-[2.5rem] px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2 text-blue-900 border-blue-200"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                تماس واتساپ برای اطلاعات بیشتر
              </button>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[var(--admin-text)] mb-3">ویژگی‌های کلیدی</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[var(--admin-muted)]">
                      <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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

        {/* تب‌ها */}
        <div className="profile-card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/80 px-2 sm:px-4">
            <nav className="flex flex-wrap gap-1 sm:gap-0" aria-label="بخش‌های محصول">
              {[
                { id: 'description' as const, label: 'توضیحات', icon: '📝' },
                { id: 'specifications' as const, label: 'مشخصات فنی', icon: '⚙️' },
                { id: 'reviews' as const, label: `نظرات (${formatPersianNumber(product.reviewCount)})`, icon: '⭐' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-sm font-semibold rounded-t-[10px] transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-[var(--admin-primary)] text-[var(--admin-primary)] bg-white'
                      : 'border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-white/60'
                  }`}
                >
                  <span aria-hidden>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="text-[var(--admin-muted)] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 py-3 border-b border-slate-100 text-sm sm:text-base"
                  >
                    <span className="font-semibold text-[var(--admin-text)] shrink-0">{key}</span>
                    <span className="text-[var(--admin-muted)] text-left sm:text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-[var(--admin-text)] font-semibold text-sm">
                            {review.user[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--admin-text)] truncate">{review.user}</p>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400' : 'text-slate-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-hidden
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--admin-muted)] shrink-0">{review.date}</span>
                      </div>
                      <p className="text-sm text-[var(--admin-muted)] leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-[var(--admin-muted)] font-medium">هنوز نظری برای این محصول ثبت نشده است.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="profile-card overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <h2 className="font-semibold text-slate-800">محصولات مرتبط</h2>
              <p className="text-xs text-[var(--admin-muted)] mt-0.5">محصولات مشابه در همین دسته</p>
            </div>
            <div className="p-4 sm:p-5">
              <FeaturedProductsSection
                layout="embedded"
                productCardVariant="catalog"
                products={relatedProducts.map((p) => ({
                  id: p._id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  images: p.images,
                  rating: p.rating,
                  reviewCount: p.reviewCount,
                  discount: p.discount,
                  stock: p.stock,
                }))}
                title=""
                description=""
                viewAllText=""
                onAddToCart={(productId) => {
                  const relatedProduct = relatedProducts.find((p) => p._id === productId);
                  if (relatedProduct) {
                    addToCart({
                      id: relatedProduct._id,
                      name: relatedProduct.name,
                      slug: relatedProduct.slug,
                      price: relatedProduct.price,
                      originalPrice: relatedProduct.originalPrice,
                      images: relatedProduct.images,
                      stock: relatedProduct.stock,
                      category: getCategoryName(relatedProduct.category),
                      brand: relatedProduct.brand,
                    });
                  }
                }}
                onViewProduct={(slug) => router.push(`/products/${slug}`)}
              />
            </div>
          </div>
        )}

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
