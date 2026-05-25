'use client';

import React from 'react';
import Link from 'next/link';
import type { Product } from '@/hooks/useApi';

type CategoryProductQuickListProps = {
  products: Product[];
  onNavigate?: () => void;
  maxItems?: number;
  className?: string;
};

export function CategoryProductQuickList({
  products,
  onNavigate,
  maxItems,
  className = '',
}: CategoryProductQuickListProps) {
  const items = maxItems ? products.slice(0, maxItems) : products;

  return (
    <ul className={`category-product-quick-list ${className}`.trim()}>
      {items.map((product) => (
        <li key={product._id}>
          <Link
            href={`/products/${product.slug}`}
            className="category-product-quick-list__row"
            onClick={onNavigate}
          >

            <span className="category-product-quick-list__name">{product.name}</span>

            <span className="category-product-quick-list__meta">

              {product.price != null && (
                <span className="category-product-quick-list__price-group">
                  <span className="category-product-quick-list__price">
                    {product.price.toLocaleString('fa-IR')}
                    <span className="category-product-quick-list__currency"> تومان</span>
                  </span>
                  {product.isOnSale && product.discount ? (
                    <span className="category-product-quick-list__badge">{product.discount}٪</span>
                  ) : null}
                </span>
              )}
            </span>
            <svg
              className="category-product-quick-list__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
