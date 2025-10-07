'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Input, Select } from '@/components/ui';

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
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  brands = [],
  className = '',
  loading = false
}) => {
  // Local state for search input to prevent focus loss
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({
          ...filters,
          search: searchValue || undefined
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, filters, onFiltersChange]);

  // Update local search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const sortOptions = [
    { value: 'createdAt', label: 'جدیدترین' },
    { value: 'price', label: 'قیمت' },
    { value: 'rating', label: 'امتیاز' },
    { value: 'name', label: 'نام' },
    { value: 'popularity', label: 'محبوبیت' },
    { value: 'stock', label: 'موجودی' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'نزولی' },
    { value: 'asc', label: 'صعودی' }
  ];

  const ratingOptions = [
    { value: '', label: 'همه امتیازها' },
    { value: '4.5', label: '۴.۵ ستاره و بالاتر' },
    { value: '4', label: '۴ ستاره و بالاتر' },
    { value: '3.5', label: '۳.۵ ستاره و بالاتر' },
    { value: '3', label: '۳ ستاره و بالاتر' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Simple Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            placeholder="نام محصول..."
            value={searchValue}
            onChange={handleSearchChange}
            disabled={loading}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Simple Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
          <Select
            value={filters.category || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('category', e.target.value || undefined)}
            disabled={loading}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">همه</option>
            {categories.map((category) => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
          <Select
            value={filters.brand || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('brand', e.target.value || undefined)}
            disabled={loading}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">همه</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">مرتب‌سازی</label>
          <Select
            value={filters.sort || 'createdAt'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('sort', e.target.value)}
            disabled={loading}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ترتیب</label>
          <Select
            value={filters.order || 'desc'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('order', e.target.value as 'asc' | 'desc')}
            disabled={loading}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {orderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Simple Quick Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">فیلترهای سریع</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleFilterChange('featured', !filters.featured)}
            disabled={loading}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              filters.featured 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            ویژه
          </button>
          <button
            onClick={() => handleFilterChange('new', !filters.new)}
            disabled={loading}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              filters.new 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            جدید
          </button>
          <button
            onClick={() => handleFilterChange('onSale', !filters.onSale)}
            disabled={loading}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              filters.onSale 
                ? 'bg-red-600 text-white border-red-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            تخفیف
          </button>
          <button
            onClick={() => handleFilterChange('inStock', !filters.inStock)}
            disabled={loading}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              filters.inStock 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            موجود
          </button>
        </div>
      </div>
    </div>
  );
};
