'use client';

import React from 'react';
import { ProductCard } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Product {
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

interface FeaturedProductsSectionProps {
  products: Product[];
  title: string;
  description: string;
  viewAllText: string;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (slug: string) => void;
  onViewAll?: () => void;
  className?: string;
  loading?: boolean;
  /** تعداد ستون کمتر = کارت‌های عریض‌تر */
  gridClassName?: string;
  /** بدون page-container / page-section — برای قرارگیری داخل کارت دیگر */
  layout?: 'default' | 'embedded';
  /** کارت محصول هم‌سبک کاتالوگ / پروفایل */
  productCardVariant?: 'default' | 'catalog';
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ 
  products, 
  title, 
  description, 
  viewAllText,
  onAddToCart,
  onViewProduct,
  onViewAll,
  className = '',
  loading = false,
  gridClassName = 'products-grid',
  layout = 'default',
  productCardVariant = 'default',
}) => {
  const embedded = layout === 'embedded';

  const body = loading ? (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/30">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm sm:text-base text-gray-800 font-semibold">در حال بارگذاری...</p>
      </div>
    </div>
  ) : (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={productCardVariant}
          onAddToCart={onAddToCart}
          onViewProduct={onViewProduct}
        />
      ))}
    </div>
  );

  if (embedded) {
    return (
      <section className={className}>
        {(title || description) && (
          <div className="section-header mb-4">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{description}</p>
          </div>
        )}
        {body}
        {viewAllText && onViewAll && (
          <div className="text-center mt-6 sm:mt-8 lg:mt-10 px-4">
            <Button 
              size="lg" 
              variant="outline"
              onClick={onViewAll}
              className="w-full xs:w-auto"
            >
              {viewAllText}
            </Button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`page-section ${className}`}>
      <div className="page-container">
        {(title || description) && (
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{description}</p>
          </div>
        )}

        {body}

        {viewAllText && onViewAll && (
          <div className="text-center mt-6 sm:mt-8 lg:mt-10 px-4">
            <Button 
              size="lg" 
              variant="outline"
              onClick={onViewAll}
              className="w-full xs:w-auto"
            >
              {viewAllText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
