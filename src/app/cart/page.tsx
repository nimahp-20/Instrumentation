'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 8h12l-1.2 10.5a1.5 1.5 0 01-1.49 1.35H8.69a1.5 1.5 0 01-1.49-1.35L6 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 8V6a3 3 0 016 0v2" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">سبد خرید خالی است</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">هنوز محصولی به سبد اضافه نکرده‌اید.</p>
        <Link href="/products">
          <Button>مشاهده محصولات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">سبد خرید</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          پاک کردن سبد
        </button>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)]">
              {item.images[0] ? (
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="80px" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 hover:text-[var(--primary)]">
                {item.name}
              </Link>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {item.price.toLocaleString('fa-IR')} تومان
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                  aria-label="کم کردن"
                >
                  −
                </button>
                <span className="text-sm font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                  className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                  aria-label="زیاد کردن"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="ms-auto text-xs text-red-600 hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)]/50">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-[var(--text-secondary)]">جمع ({totalItems} قلم)</span>
          <span className="font-bold text-[var(--text-primary)]">{totalPrice.toLocaleString('fa-IR')} تومان</span>
        </div>
        <Link href="/products">
          <Button className="w-full">ادامه خرید</Button>
        </Link>
      </div>
    </div>
  );
}
