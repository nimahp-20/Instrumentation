'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconHeart, IconShopping } from './ProfileIcons';

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
    <div className="profile-card p-6 md:p-8">
      <h2 className="text-xl font-bold text-[var(--admin-text)] mb-6 flex items-center gap-2.5">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 bg-rose-50 border border-rose-100">
          <IconHeart className="w-5 h-5" />
        </span>
        محصولات مورد علاقه
      </h2>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-14 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-[var(--admin-muted)]">
            <IconHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-2">هیچ محصولی در علاقه‌مندی‌ها نیست</h3>
          <p className="text-[var(--admin-muted)] mb-6 max-w-md mx-auto">محصولات مورد علاقهٔ خود را اینجا می‌بینید.</p>
          <Link href="/products" className="profile-btn-primary inline-flex items-center gap-2 px-6 py-3">
            <IconShopping className="w-5 h-5" />
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-[var(--admin-radius)] border border-slate-200/90 bg-slate-50/50 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-slate-200/60">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <button
                  type="button"
                  className="absolute top-3 start-3 p-2.5 bg-white/95 rounded-xl shadow-md border border-slate-100 text-rose-500 hover:bg-rose-50 transition-colors"
                  aria-label="حذف از علاقه‌مندی"
                >
                  <IconHeart className="w-5 h-5 text-rose-500" />
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs text-[var(--admin-muted)] bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">{product.category}</span>
                <h3 className="font-semibold text-[var(--admin-text)] mt-2 mb-1 leading-snug">{product.name}</h3>
                <p className="text-lg font-bold text-[var(--admin-primary)]">{product.price.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
