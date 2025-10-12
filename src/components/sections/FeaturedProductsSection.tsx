'use client';

import React from 'react';
import { ProductCard, Button, LoadingSpinner } from '@/components/ui';

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
  loading = false
}) => {
  return (
    <section className={`py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="w-full">
        {(title || description) && (
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/30">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-sm sm:text-base text-gray-800 font-semibold">در حال بارگذاری...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        )}

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
