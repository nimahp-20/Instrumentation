'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface FavoritesTabProps {
  favoriteProducts: FavoriteProduct[];
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoriteProducts }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">❤️</span>
        محصولات مورد علاقه
      </h2>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ محصولی در علاقه‌مندی‌ها نیست</h3>
          <p className="text-gray-600 mb-6">محصولات مورد علاقه خود را اینجا مشاهده کنید</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <span className="mr-2">🛍️</span>
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
                  <span className="text-lg">❤️</span>
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{product.category}</span>
                <h3 className="font-medium text-gray-900 mt-2 mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
