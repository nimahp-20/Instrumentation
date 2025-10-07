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
    <section className={`py-4 ${className}`}>
      <div className="w-full">
        {(title || description) && (
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        )}

        {loading ? (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-800 font-semibold">در حال بارگذاری...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              variant="outline"
              onClick={onViewAll}
            >
              {viewAllText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
