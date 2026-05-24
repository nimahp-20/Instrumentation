'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  new?: boolean;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  page?: number;
}

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: Array<{ _id: string; name: string; slug: string }>;
  brands?: string[];
  className?: string;
  loading?: boolean;
  /** روی صفحهٔ یک دسته‌بندی — انتخاب دسته مخفی می‌شود */
  hideCategorySelect?: boolean;
}

const chipActiveStyle = {
  background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
} as const;

const labelCls = 'block text-sm font-semibold text-[var(--admin-text)] mb-2';

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  brands = [],
  className = '',
  loading = false,
  hideCategorySelect = false,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const nextSearch = searchValue.trim() || undefined;
      const current = filtersRef.current;
      const prevSearch = current.search || undefined;
      if (nextSearch !== prevSearch) {
        onFiltersChange({
          ...current,
          search: nextSearch,
          page: 1,
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onFiltersChange]);

  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const handleFilterChange = (key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
    const next: ProductFilters = {
      ...filters,
      [key]: value,
    };
    if (key === 'sort' || key === 'order') {
      next.page = 1;
    }
    onFiltersChange(next);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const sortOptions = [
    { value: 'createdAt', label: 'جدیدترین' },
    { value: 'price', label: 'قیمت' },
    { value: 'rating', label: 'امتیاز' },
    { value: 'name', label: 'نام' },
    { value: 'popularity', label: 'محبوبیت' },
    { value: 'stock', label: 'موجودی' },
  ];

  const orderOptions = [
    { value: 'desc', label: 'نزولی' },
    { value: 'asc', label: 'صعودی' },
  ];

  type QuickKey = 'featured' | 'new' | 'onSale' | 'inStock';
  const quickItems: { key: QuickKey; label: string }[] = [
    { key: 'featured', label: 'ویژه' },
    { key: 'new', label: 'جدید' },
    { key: 'onSale', label: 'تخفیف' },
    { key: 'inStock', label: 'موجود' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* جستجو */}
      <div>
        <label htmlFor="product-filter-search" className={labelCls}>
          جستجو
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--admin-muted)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="product-filter-search"
            type="search"
            placeholder="نام محصول..."
            value={searchValue}
            onChange={handleSearchChange}
            disabled={loading}
            className="profile-input w-full py-2.5 pr-10 pl-3 text-sm placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-4">
        {!hideCategorySelect && (
          <div>
            <label htmlFor="product-filter-category" className={labelCls}>
              دسته‌بندی
            </label>
            <select
              id="product-filter-category"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              disabled={loading}
              className="profile-select w-full py-2.5 text-sm min-h-[2.75rem] disabled:opacity-50"
            >
              <option value="">همه</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="product-filter-brand" className={labelCls}>
            برند
          </label>
          <select
            id="product-filter-brand"
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
            disabled={loading}
            className="profile-select w-full py-2.5 text-sm min-h-[2.75rem] disabled:opacity-50"
          >
            <option value="">همه</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="product-filter-sort" className={labelCls}>
              مرتب‌سازی
            </label>
            <select
              id="product-filter-sort"
              value={filters.sort || 'createdAt'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              disabled={loading}
              className="profile-select w-full py-2.5 text-sm min-h-[2.75rem] disabled:opacity-50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="product-filter-order" className={labelCls}>
              ترتیب
            </label>
            <select
              id="product-filter-order"
              value={filters.order || 'desc'}
              onChange={(e) => handleFilterChange('order', e.target.value as 'asc' | 'desc')}
              disabled={loading}
              className="profile-select w-full py-2.5 text-sm min-h-[2.75rem] disabled:opacity-50"
            >
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* فیلترهای سریع — هم‌سبک تب‌های پروفایل */}
      <div className="border-t border-slate-100 pt-5">
        <p className={labelCls}>فیلترهای سریع</p>
        <div className="rounded-[10px] bg-slate-100/80 p-1.5 grid grid-cols-2 gap-1.5">
          {quickItems.map(({ key, label }) => {
            const active = Boolean(filters[key]);
            return (
              <button
                key={key}
                type="button"
                disabled={loading}
                onClick={() => handleFilterChange(key, !filters[key])}
                className={`min-h-touch rounded-[10px] px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'text-white shadow-md'
                    : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-white/90'
                } disabled:opacity-50`}
                style={active ? chipActiveStyle : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
