import React from 'react';
import { formatPriceRange, formatPersianNumber } from '@/lib/price-utils';

export interface ProductCardProduct {
  id: string;
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

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (slug: string) => void;
  /** هم‌سبک کارت پروفایل / کاتالوگ — فقط داخل `.profile-shell` دکمه‌های تم کامل می‌شوند */
  variant?: 'default' | 'catalog';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewProduct,
  variant = 'default',
}) => {
  const catalog = variant === 'catalog';

  const discountPercentage =
    product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const priceInfo = formatPriceRange(product.price, product.originalPrice);

  const shellClass = catalog
    ? 'rounded-[12px] border border-slate-200/90 bg-[var(--admin-card)] shadow-[var(--admin-shadow)] hover:shadow-lg'
    : 'card-base hover:shadow-md';

  return (
    <article
      className={`group flex flex-col h-full min-h-[400px] sm:min-h-[420px] overflow-hidden transition-all duration-200 ${shellClass}`}
    >
      <div className="relative p-4 sm:p-5 pb-0">
        <div
          className={`aspect-[5/4] sm:aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ${
            catalog ? 'ring-1 ring-sky-100/90' : 'ring-1 ring-slate-100'
          }`}
        >
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        {discountPercentage > 0 && (
          <span className="absolute top-6 right-6 sm:top-7 sm:right-7 bg-gradient-to-br from-rose-500 to-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-[10px] shadow-sm">
            -{formatPersianNumber(discountPercentage)}٪
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-6 right-6 sm:top-7 sm:right-7 bg-slate-700 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-[10px]">
            ناموجود
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5 pt-4 sm:pt-5 gap-3 sm:gap-4">
        <h3
          className={`text-sm sm:text-[0.9375rem] font-semibold leading-6 line-clamp-2 min-h-[3rem] ${
            catalog ? 'text-[var(--admin-text)]' : 'text-slate-900'
          }`}
        >
          <p className='text-sm sm:text-[0.9375rem]'>{product.name}</p>
        </h3>

        <div
          className={`flex items-center justify-between gap-2 text-xs ${
            catalog ? 'text-[var(--admin-muted)]' : 'text-slate-600'
          }`}
        >
          <div className="flex items-center gap-1 min-w-0" aria-label={`امتیاز ${product.rating}`}>
            <div className="flex items-center gap-0.5">
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
            </div>
            <span className="text-slate-500 shrink-0 tabular-nums">({formatPersianNumber(product.reviewCount)})</span>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
            title={product.stock > 0 ? 'موجود' : 'ناموجود'}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className={`text-base sm:text-lg font-bold tabular-nums ${
                catalog ? 'text-[var(--admin-text)]' : 'text-slate-900'
              }`}
            >
              {priceInfo.current}
            </span>
            <span className={`text-xs ${catalog ? 'text-[var(--admin-muted)]' : 'text-slate-500'}`}>تومان</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 min-h-[1.25rem]">
            {priceInfo.original && (
              <span className="text-xs text-slate-500 line-through tabular-nums">{priceInfo.original}</span>
            )}
            {priceInfo.discount && (
              <span className="inline-flex items-center rounded-[8px] bg-red-50 text-red-700 border border-red-100/90 text-[11px] font-medium px-2 py-0.5">
                {priceInfo.discount}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          {catalog ? (
            <>
              <button
                type="button"
                onClick={() => onAddToCart?.(product.id)}
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
                افزودن به سبد
              </button>
              <button
                type="button"
                onClick={() => onViewProduct?.(product.slug)}
                className="profile-btn-accent-ghost w-full inline-flex items-center justify-center min-h-[2.5rem] px-4 py-2 text-sm"
              >
                مشاهده محصول
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onAddToCart?.(product.id)}
                disabled={product.stock === 0}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2.5 text-sm font-bold rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 active:bg-amber-500 shadow-sm transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                افزودن به سبد
              </button>
              <button
                type="button"
                onClick={() => onViewProduct?.(product.slug)}
                className="w-full inline-flex items-center justify-center min-h-[2.5rem] px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                مشاهده محصول
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
