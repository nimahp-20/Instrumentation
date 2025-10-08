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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">👤</span>
            <span>پروفایل</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">❤️</span>
            <span>علاقه‌مندی‌ها</span>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{favoritesCount}</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">📦</span>
            <span>سفارش‌ها</span>
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{ordersCount}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
