'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, LoadingSpinner, SearchCategory } from '@/components/ui';

interface Category {
  name: string;
  image: string;
  count: string;
  href: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  title: string;
  description: string;
  className?: string;
  loading?: boolean;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  title, 
  description, 
  className = '',
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  // Filter categories based on search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleCategorySelect = (category: any) => {
    // Navigate to category page
    window.location.href = `/categories/${category.slug}`;
  };

  return (
    <section id="categories" className={`py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {description}
          </p>
          
          {/* Search Category Component */}
          <div className="max-w-md mx-auto">
            <SearchCategory
              placeholder="جستجو در دسته‌بندی‌ها..."
              onCategorySelect={handleCategorySelect}
              className="w-full"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">هیچ دسته‌بندی‌ای یافت نشد</h3>
            <p className="text-gray-500 mb-6">لطفاً عبارت جستجوی خود را تغییر دهید</p>
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              بازنشانی جستجو
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <Link key={index} href={category.href} className="group">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Image Container with Gradient Overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-lg">
                    {category.count}
                  </div>
                  
                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>محصولات موجود</span>
                      <span>{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 group-hover:from-blue-600 group-hover:to-indigo-600"
                        style={{ width: `${Math.min(100, (parseInt(category.count) / 200) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                    <span className="text-sm">مشاهده محصولات</span>
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Link>
          ))}
        </div>
        )}

       
      </div>
    </section>
  );
};
