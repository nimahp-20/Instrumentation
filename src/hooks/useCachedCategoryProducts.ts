'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/hooks/useApi';
import {
  fetchCategoryProductsCached,
  getCachedCategoryProducts,
} from '@/lib/category-products-cache';

export function useCachedCategoryProducts(
  categorySlug: string | null,
  options?: {
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    enabled?: boolean;
  },
) {
  const limit = options?.limit ?? 12;
  const sort = options?.sort ?? 'createdAt';
  const order = options?.order ?? 'desc';
  const enabled = options?.enabled !== false && Boolean(categorySlug);

  const [products, setProducts] = useState<Product[]>(() => {
    if (!categorySlug) return [];
    return getCachedCategoryProducts(categorySlug, limit, sort, order) ?? [];
  });
  const [loading, setLoading] = useState(() => {
    if (!categorySlug || !enabled) return false;
    return !getCachedCategoryProducts(categorySlug, limit, sort, order);
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !categorySlug) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = getCachedCategoryProducts(categorySlug, limit, sort, order);
    if (cached) {
      setProducts(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryProductsCached(categorySlug, { limit, sort, order })
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'خطا در بارگذاری محصولات');
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, limit, sort, order, enabled]);

  return { products, loading, error };
}
