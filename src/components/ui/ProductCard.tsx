'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  /** برای انیمیشن ورود تدریجی در گرید */
  animationIndex?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewProduct,
  variant = 'default',
  animationIndex = 0,
}) => {
  const catalog = variant === 'catalog';
  const compact = catalog;
  const mobileInteractive = compact && catalog;

  const [actionsOpen, setActionsOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const closeActions = useCallback(() => setActionsOpen(false), []);

  useEffect(() => {
    if (!actionsOpen || !mobileInteractive) return;
    const onPointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        closeActions();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [actionsOpen, mobileInteractive, closeActions]);

  const discountPercentage =
    product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const priceInfo = formatPriceRange(product.price, product.originalPrice);

  const shellClass = catalog
    ? 'rounded-[12px] border border-slate-200/90 bg-[var(--admin-card)] shadow-[var(--admin-shadow)] hover:shadow-lg'
    : 'card-base hover:shadow-md';

  const handleCardTap = (e: React.MouseEvent) => {
    if (!mobileInteractive) return;
    if ((e.target as HTMLElement).closest('[data-card-action]')) return;
    setActionsOpen((open) => !open);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
    if (mobileInteractive) closeActions();
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProduct?.(product.slug);
    if (mobileInteractive) closeActions();
  };

  const enterStyle =
    animationIndex > 0
      ? ({ animationDelay: `${Math.min(animationIndex * 55, 400)}ms` } as React.CSSProperties)
      : undefined;

  const selectedMobileClass =
    mobileInteractive && actionsOpen
      ? 'border-sky-100/90 shadow-[0_6px_22px_-10px_rgba(56,189,248,0.35)]'
      : '';

  const imageFrameClass = `relative w-full rounded-xl overflow-hidden bg-slate-100 ${compact ? 'aspect-square sm:aspect-[4/3]' : 'aspect-[5/4] sm:aspect-[4/3]'
    } ${catalog ? 'ring-1 ring-sky-100/90' : 'ring-1 ring-slate-100'}`;

  return (
    <article
      ref={cardRef}
      style={enterStyle}
      onClick={handleCardTap}
      role={mobileInteractive ? 'button' : undefined}
      tabIndex={mobileInteractive ? 0 : undefined}
      aria-expanded={mobileInteractive ? actionsOpen : undefined}
      aria-label={mobileInteractive ? (actionsOpen ? 'بستن عملیات محصول' : `عملیات ${product.name}`) : undefined}
      onKeyDown={
        mobileInteractive
          ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActionsOpen((open) => !open);
            }
            if (e.key === 'Escape') closeActions();
          }
          : undefined
      }
      className={`product-card-enter group relative flex flex-col h-full overflow-hidden transition-all duration-300 touch-manipulation ${compact ? 'min-h-0' : 'min-h-[400px] sm:min-h-[420px]'
        } ${shellClass} ${selectedMobileClass} ${mobileInteractive ? 'sm:cursor-default cursor-pointer active:scale-[0.99] sm:active:scale-100' : ''
        }`}
    >
      {/* لایه عملیات موبایل — کل کارت */}
      {mobileInteractive && actionsOpen && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-stretch justify-center gap-2 p-3 sm:hidden product-card-actions-overlay pointer-events-none"
          aria-hidden
        >
          <button
            type="button"
            data-card-action
            onClick={handleViewProduct}
            className="profile-btn-accent-ghost pointer-events-auto w-full inline-flex items-center justify-center gap-1.5 min-h-[2.35rem] px-2 py-2 text-[11px] font-semibold bg-white/92 backdrop-blur-md shadow-sm whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            مشاهده جزئیات
          </button>
          <button
            type="button"
            data-card-action
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="profile-btn-primary pointer-events-auto w-full inline-flex items-center justify-center gap-1.5 min-h-[2.35rem] px-2 py-2 text-[11px] font-semibold shadow-sm whitespace-nowrap disabled:opacity-45"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
            افزودن به سبد
          </button>
        </div>
      )}

      {mobileInteractive && actionsOpen && (
        <div
          className="absolute inset-0 z-10 bg-white/25 backdrop-blur-[2px] sm:hidden pointer-events-none transition-opacity duration-300"
          aria-hidden
        />
      )}

      <div
        className={`relative pb-0 transition-opacity duration-300 ${compact ? 'p-2 sm:p-4' : 'p-4 sm:p-5'
          } ${mobileInteractive && actionsOpen ? 'opacity-40 sm:opacity-100' : ''}`}
      >
        <div className={imageFrameClass}>
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] ${mobileInteractive && actionsOpen ? 'blur-[5px] scale-[1.03] sm:blur-0 sm:scale-100' : ''
              }`}
          />
          {mobileInteractive && !actionsOpen && (
            <span
              className="absolute bottom-2 inset-x-2 sm:hidden flex justify-center pointer-events-none"
              aria-hidden
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-white/88 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium text-slate-500 shadow-sm">
                <svg className="w-2.5 h-2.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                </svg>
                لمس برای عملیات
              </span>
            </span>
          )}
        </div>
        {discountPercentage > 0 && (
          <span
            className={`absolute z-[5] bg-gradient-to-br from-rose-500 to-red-600 text-white font-bold rounded-[8px] shadow-sm ${compact
                ? 'top-3 right-3 text-[10px] px-1.5 py-0.5'
                : 'top-6 right-6 sm:top-7 sm:right-7 text-[11px] sm:text-xs px-2.5 py-1 rounded-[10px]'
              }`}
          >
            -{formatPersianNumber(discountPercentage)}٪
          </span>
        )}
        {product.stock === 0 && (
          <span
            className={`absolute z-[5] bg-slate-700 text-white font-bold rounded-[8px] ${compact
                ? 'top-3 right-3 text-[10px] px-1.5 py-0.5'
                : 'top-6 right-6 sm:top-7 sm:right-7 text-[11px] sm:text-xs px-2.5 py-1 rounded-[10px]'
              }`}
          >
            ناموجود
          </span>
        )}
      </div>

      <div
        className={`flex flex-col flex-1 transition-opacity duration-300 ${compact ? 'p-2 sm:p-4 pt-2 sm:pt-4 gap-2 sm:gap-3' : 'p-4 sm:p-5 pt-4 sm:pt-5 gap-3 sm:gap-4'
          } ${mobileInteractive && actionsOpen ? 'opacity-40 sm:opacity-100' : ''}`}
      >
        <h3
          className={`line-clamp-2 ${compact
              ? 'text-[0.6875rem] sm:text-[0.9375rem] font-semibold leading-4 sm:leading-snug min-h-[2rem] sm:min-h-[3rem]'
              : 'text-sm sm:text-[0.9375rem] font-semibold leading-6 min-h-[3rem]'
            } ${catalog ? 'text-[var(--admin-text)]' : 'text-slate-900'}`}
        >
          <p className='text-sm font-semibold text-[var(--admin-text)]'>
            {product.name}
          </p>

        </h3>

        <div
          className={`flex items-center justify-between gap-1 text-xs ${catalog ? 'text-[var(--admin-muted)]' : 'text-slate-600'
            }`}
        >
          <div className="flex items-center gap-0.5 min-w-0" aria-label={`امتیاز ${product.rating}`}>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`shrink-0 ${compact ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-3.5 h-3.5'} ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={`text-slate-500 shrink-0 tabular-nums ${compact ? 'hidden sm:inline' : ''}`}>
              ({formatPersianNumber(product.reviewCount)})
            </span>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
            title={product.stock > 0 ? 'موجود' : 'ناموجود'}
          />
        </div>

        <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
            <span
              className={`font-bold tabular-nums ${compact ? 'text-sm sm:text-lg' : 'text-base sm:text-lg'
                } ${catalog ? 'text-[var(--admin-text)]' : 'text-slate-900'}`}
            >
              {priceInfo.current}
            </span>
            <span className={`text-[10px] sm:text-xs ${catalog ? 'text-[var(--admin-muted)]' : 'text-slate-500'}`}>
              تومان
            </span>
          </div>
          <div className={`flex flex-wrap items-center gap-1 ${compact ? 'min-h-[1rem]' : 'min-h-[1.25rem]'}`}>
            {priceInfo.original && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through tabular-nums">{priceInfo.original}</span>
            )}
            {priceInfo.discount && (
              <span className="inline-flex items-center rounded-[6px] bg-red-50 text-red-700 border border-red-100/90 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5">
                {priceInfo.discount}
              </span>
            )}
          </div>
        </div>

        <div
          className={`mt-auto flex-col pt-1 ${compact ? 'gap-1.5' : 'gap-2'} ${catalog ? 'hidden sm:flex' : 'flex'
            }`}
        >
          {catalog ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="profile-btn-primary w-full inline-flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2 text-sm disabled:opacity-45 disabled:cursor-not-allowed"
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
                onClick={handleViewProduct}
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
