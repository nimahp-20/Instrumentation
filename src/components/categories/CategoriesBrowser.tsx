'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useApi';
import { useCachedCategoryProducts } from '@/hooks/useCachedCategoryProducts';
import { prefetchCategoryProducts } from '@/lib/category-products-cache';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  ALL_PRODUCTS_SIDEBAR_ID,
  NEWEST_SIDEBAR_ID,
  buildCategoryGrid,
  getAllProductsHref,
  getSelectedCategorySlug,
  getSidebarLabel,
  partitionCategories,
  productsToGridCells,
  type SidebarSelectionId,
} from '@/lib/category-nav';
import { CategorySidebarIcon } from '@/components/categories/CategorySidebarIcon';
import { CategoryProductQuickList } from '@/components/categories/CategoryProductQuickList';

function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const isLocal = src.startsWith('/') && !src.startsWith('//');

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        width={120}
        height={120}
        className="categories-browser__cell-img"
        sizes="33vw"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="categories-browser__cell-img" loading="lazy" />
  );
}

export function CategoriesBrowser() {
  const { categories, loading, error } = useCategories({ sort: 'sortOrder' });
  const [selectedId, setSelectedId] = useState<SidebarSelectionId>(NEWEST_SIDEBAR_ID);

  const { roots, childrenByParent } = useMemo(
    () => partitionCategories(categories),
    [categories],
  );

  useEffect(() => {
    if (!loading && roots.length > 0 && selectedId !== NEWEST_SIDEBAR_ID) {
      const isRoot = roots.some((r) => r._id === selectedId);
      const isSpecial =
        selectedId === NEWEST_SIDEBAR_ID || selectedId === ALL_PRODUCTS_SIDEBAR_ID;
      if (!isSpecial && !isRoot && !childrenByParent.has(selectedId)) {
        const hasParent = categories.some((c) => c._id === selectedId);
        if (!hasParent) setSelectedId(NEWEST_SIDEBAR_ID);
      }
    }
  }, [loading, roots, categories, childrenByParent, selectedId]);

  const categorySlug = useMemo(
    () => getSelectedCategorySlug(selectedId, categories, childrenByParent),
    [selectedId, categories, childrenByParent],
  );

  const showCategoryGrid = categorySlug === null;

  const { products, loading: productsLoading, error: productsError } = useCachedCategoryProducts(
    categorySlug,
    { limit: 30, sort: 'createdAt', order: 'desc', enabled: categorySlug !== null },
  );

  useEffect(() => {
    if (roots.length > 0) {
      prefetchCategoryProducts(
        roots.map((r) => r.slug),
        { limit: 30, sort: 'createdAt', order: 'desc' },
      );
    }
  }, [roots]);

  const gridCells = useMemo(() => {
    if (showCategoryGrid) {
      return buildCategoryGrid(selectedId, categories, roots, childrenByParent);
    }
    return productsToGridCells(products);
  }, [showCategoryGrid, selectedId, categories, roots, childrenByParent, products]);

  const gridLoading = showCategoryGrid ? false : productsLoading;

  const sidebarLabel = getSidebarLabel(selectedId, categories);
  const allProductsHref = getAllProductsHref(selectedId, categories);

  const sidebarItems = useMemo(() => {
    const items: Array<{
      id: SidebarSelectionId;
      label: string;
      variant: 'newest' | 'all' | 'category';
      index: number;
    }> = [
      { id: NEWEST_SIDEBAR_ID, label: 'جدیدترین\u200cها', variant: 'newest', index: 0 },
      ...roots.map((cat, index) => ({
        id: cat._id as SidebarSelectionId,
        label: cat.name,
        variant: 'category' as const,
        index,
      })),
      { id: ALL_PRODUCTS_SIDEBAR_ID, label: 'همه محصولات', variant: 'all', index: 0 },
    ];
    return items;
  }, [roots]);

  if (loading) {
    return (
      <div className="categories-browser categories-browser--loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-browser categories-browser--loading">
        <p className="text-sm text-[var(--danger)] px-4 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="categories-browser">
      <aside className="categories-browser__sidebar" aria-label="دسته\u200cبندی\u200cهای اصلی">
        <ul className="categories-browser__sidebar-list">
          {sidebarItems.map((item) => {
            const active = selectedId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`categories-browser__sidebar-item${active ? ' categories-browser__sidebar-item--active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="categories-browser__sidebar-icon-wrap">
                    <CategorySidebarIcon
                      variant={item.variant}
                      index={item.index}
                      className="categories-browser__sidebar-icon"
                    />
                  </span>
                  <span className="categories-browser__sidebar-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="categories-browser__main">
        <Link href={allProductsHref} className="categories-browser__all-link">
          <span>همه کالاهای {sidebarLabel}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {gridLoading ? (
          <div className="categories-browser__empty">
            <LoadingSpinner size="md" />
          </div>
        ) : productsError && !showCategoryGrid ? (
          <div className="categories-browser__empty">
            <p className="text-sm text-[var(--danger)]">{productsError}</p>
          </div>
        ) : gridCells.length === 0 ? (
          <div className="categories-browser__empty">
            <p className="text-sm text-[var(--text-muted)]">
              {showCategoryGrid
                ? 'دسته\u200cبندی فعالی یافت نشد.'
                : 'محصولی در این دسته\u200cبندی یافت نشد.'}
            </p>
            <Link href={allProductsHref} className="text-sm font-medium text-[var(--primary)]">
              {showCategoryGrid ? 'مشاهده محصولات' : 'مشاهده همه کالاها'}
            </Link>
          </div>
        ) : showCategoryGrid ? (
          <div className="categories-browser__grid-wrap">
            <ul className="categories-browser__grid">
              {gridCells.map((cell) => (
                <li key={cell.id}>
                  <Link href={cell.href} className="categories-browser__cell">
                    <div className="categories-browser__cell-media">
                      <CategoryImage src={cell.image} alt={cell.name} />
                    </div>
                    <span className="categories-browser__cell-label">{cell.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={allProductsHref} className="categories-browser__cell categories-browser__cell--view-all">
                  <div className="categories-browser__cell-media categories-browser__cell-media--icon">
                    <CategorySidebarIcon variant="all" className="categories-browser__view-all-icon" />
                  </div>
                  <span className="categories-browser__cell-label">همه کالاها</span>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="categories-browser__grid-wrap">
            <CategoryProductQuickList
              products={products}
              className="category-product-quick-list--mobile"
            />
            <Link
              href={allProductsHref}
              className="categories-browser__view-all-row"
            >
              مشاهده همه کالاها
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
