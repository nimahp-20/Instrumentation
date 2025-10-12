'use client';

import React from 'react';

export type TabType = 'profile' | 'favorites' | 'orders';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
  ordersCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  favoritesCount, 
  ordersCount 
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-4 sm:mb-6">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-base sm:text-lg">👤</span>
            <span className="hidden xs:inline">پروفایل</span>
            <span className="xs:hidden">پروفایل</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-base sm:text-lg">❤️</span>
            <span className="hidden sm:inline">علاقه‌مندی‌ها</span>
            <span className="sm:hidden">علاقه‌ها</span>
            <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">{favoritesCount}</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-base sm:text-lg">📦</span>
            <span className="hidden sm:inline">سفارش‌ها</span>
            <span className="sm:hidden">سفارش</span>
            <span className="bg-blue-100 text-blue-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">{ordersCount}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
