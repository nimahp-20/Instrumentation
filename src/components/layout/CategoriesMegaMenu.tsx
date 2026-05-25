'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCategories } from '@/hooks/useApi';
import { useCachedCategoryProducts } from '@/hooks/useCachedCategoryProducts';
import { prefetchCategoryProducts } from '@/lib/category-products-cache';
import { partitionCategories } from '@/lib/category-nav';
import { CategoryProductQuickList } from '@/components/categories/CategoryProductQuickList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Category } from '@/hooks/useApi';

function CategoryThumb({ src, alt }: { src: string; alt: string }) {
  const isLocal = src.startsWith('/') && !src.startsWith('//');
  if (isLocal) {
    return (
      <Image src={src} alt={alt} width={64} height={64} className="header-mega-menu__thumb-img" sizes="64px" />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="header-mega-menu__thumb-img" loading="lazy" />
  );
}

type CategoriesMegaMenuTriggerProps = {
  isOpen: boolean;
  onOpen: () => void;
};

export const CategoriesMegaMenuTrigger: React.FC<CategoriesMegaMenuTriggerProps> = ({
  isOpen,
  onOpen,
}) => {
  const pathname = usePathname();
  const isCategoriesActive =
    pathname === '/categories' || pathname?.startsWith('/categories/');

  return (
    <span className="header-mega-menu">
      <Link
        href="/categories"
        className={`header-nav-link header-mega-menu__trigger${isCategoriesActive ? ' header-nav-link--active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onMouseEnter={onOpen}
        onFocus={onOpen}
      >
        دسته‌بندی‌ها
        <svg
          className={`header-mega-menu__chevron${isOpen ? ' header-mega-menu__chevron--open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
    </span>
  );
};

type CategoriesMegaMenuPanelProps = {
  onClose: () => void;
};

export const CategoriesMegaMenuPanel: React.FC<CategoriesMegaMenuPanelProps> = ({ onClose }) => {
  const { categories, loading } = useCategories({ sort: 'sortOrder' });
  const [activeId, setActiveId] = useState<string | null>(null);

  const { roots, childrenByParent } = useMemo(
    () => partitionCategories(categories),
    [categories],
  );

  useEffect(() => {
    if (roots.length > 0 && !activeId) {
      setActiveId(roots[0]._id);
    }
  }, [roots, activeId]);

  useEffect(() => {
    if (roots.length > 0) {
      prefetchCategoryProducts(
        roots.map((r) => r.slug),
        { limit: 12, sort: 'createdAt', order: 'desc' },
      );
    }
  }, [roots]);

  const activeCategory = roots.find((c) => c._id === activeId) ?? roots[0];
  const activeChildren = activeCategory
    ? childrenByParent.get(activeCategory._id) ?? []
    : [];

  return (
    <div className="header-mega-menu__panel" role="region" aria-label="منوی دسته‌بندی‌ها">
      <div className="header-mega-menu__panel-inner">
        <div className="header-mega-menu__quick">
          <Link
            href="/products?sort=createdAt&order=desc"
            className="header-mega-menu__quick-link"
            onClick={onClose}
          >
            جدیدترین‌ها
          </Link>
          <Link href="/products" className="header-mega-menu__quick-link" onClick={onClose}>
            همه محصولات
          </Link>
          <Link href="/categories" className="header-mega-menu__quick-link--muted" onClick={onClose}>
            صفحه دسته‌بندی‌ها
          </Link>
        </div>

        <div className="header-mega-menu__body">
          <ul className="header-mega-menu__roots" aria-label="دسته‌های اصلی">
            {loading ? (
              <li className="header-mega-menu__loading">در حال بارگذاری...</li>
            ) : (
              roots.map((cat) => (
                <li key={cat._id}>
                  <button
                    type="button"
                    className={`header-mega-menu__root${activeCategory?._id === cat._id ? ' header-mega-menu__root--active' : ''}`}
                    onMouseEnter={() => setActiveId(cat._id)}
                    onFocus={() => setActiveId(cat._id)}
                  >
                    <CategoryThumb src={cat.image} alt="" />
                    <span>{cat.name}</span>
                    {cat.productCount > 0 && (
                      <span className="header-mega-menu__count">{cat.productCount}</span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="header-mega-menu__detail">
            {activeCategory ? (
              <>
                <div className="header-mega-menu__detail-head">
                  <h3 className="header-mega-menu__detail-title">{activeCategory.name}</h3>
                  <Link
                    href={`/categories/${activeCategory.slug}`}
                    className="header-mega-menu__all-link"
                    onClick={onClose}
                  >
                    همه کالاهای {activeCategory.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                </div>

                {activeChildren.length > 0 ? (
                  <ul className="header-mega-menu__grid">
                    {activeChildren.map((child) => (
                      <li key={child._id}>
                        <Link
                          href={`/categories/${child.slug}`}
                          className="header-mega-menu__card"
                          onClick={onClose}
                        >
                          <div className="header-mega-menu__card-media">
                            <CategoryThumb src={child.image} alt={child.name} />
                          </div>
                          <span className="header-mega-menu__card-label">{child.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <MegaMenuCategoryProducts
                    key={activeCategory._id}
                    category={activeCategory}
                    onClose={onClose}
                  />
                )}
              </>
            ) : (
              <p className="header-mega-menu__empty">دسته‌بندی‌ای ثبت نشده است.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function MegaMenuCategoryProducts({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const { products, loading, error } = useCachedCategoryProducts(category.slug, {
    limit: 12,
    sort: 'createdAt',
    order: 'desc',
  });

  if (loading) {
    return (
      <div className="header-mega-menu__products-loading">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return <p className="header-mega-menu__empty">{error}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="header-mega-menu__fallback">
        <p className="header-mega-menu__fallback-hint">
          محصولی در این دسته ثبت نشده است.
        </p>
        <Link
          href={`/categories/${category.slug}`}
          className="header-mega-menu__all-link"
          onClick={onClose}
        >
          صفحه {category.name}
        </Link>
      </div>
    );
  }

  return (
    <CategoryProductQuickList
      products={products}
      onNavigate={onClose}
      className="category-product-quick-list--mega"
    />
  );
}

/** @deprecated از Trigger + Panel در Header استفاده کنید */
export const CategoriesMegaMenu: React.FC<CategoriesMegaMenuTriggerProps & { onClose: () => void }> = ({
  isOpen,
  onOpen,
  onClose,
}) => (
  <>
    <CategoriesMegaMenuTrigger isOpen={isOpen} onOpen={onOpen} />
    {isOpen && <CategoriesMegaMenuPanel onClose={onClose} />}
  </>
);
