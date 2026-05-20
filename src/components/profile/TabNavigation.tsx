'use client';

import React from 'react';
import { IconBox, IconHeart, IconUser } from './ProfileIcons';

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
  ordersCount,
}) => {
  const tabClass = (tab: TabType) => {
    const active = activeTab === tab;
    return `flex-shrink-0 flex items-center justify-center gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-[10px] text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
      active
        ? 'text-white shadow-md'
        : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-slate-100/90'
    }`;
  };

  const activeStyle =
    { background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)' } as const;

  return (
    <div className="profile-card p-1.5 sm:p-2 mb-5 sm:mb-6">
      <div className="flex rounded-[10px] bg-slate-100/80 p-1 gap-1 overflow-x-auto scrollbar-thin">
        <button type="button" onClick={() => onTabChange('profile')} className={tabClass('profile')} style={activeTab === 'profile' ? activeStyle : undefined}>
          <IconUser className={`w-5 h-5 shrink-0 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70'}`} />
          <span>پروفایل</span>
        </button>
        <button type="button" onClick={() => onTabChange('favorites')} className={tabClass('favorites')} style={activeTab === 'favorites' ? activeStyle : undefined}>
          <IconHeart className={`w-5 h-5 shrink-0 ${activeTab === 'favorites' ? 'opacity-100' : 'opacity-70'}`} />
          <span className="hidden xs:inline">علاقه‌مندی‌ها</span>
          <span className="xs:hidden">علاقه‌ها</span>
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'favorites' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {favoritesCount}
          </span>
        </button>
        <button type="button" onClick={() => onTabChange('orders')} className={tabClass('orders')} style={activeTab === 'orders' ? activeStyle : undefined}>
          <IconBox className={`w-5 h-5 shrink-0 ${activeTab === 'orders' ? 'opacity-100' : 'opacity-70'}`} />
          <span className="hidden sm:inline">سفارش‌ها</span>
          <span className="sm:hidden">سفارش</span>
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'orders' ? 'bg-white/25 text-white' : 'bg-sky-100 text-sky-800'
            }`}
          >
            {ordersCount}
          </span>
        </button>
      </div>
    </div>
  );
};
