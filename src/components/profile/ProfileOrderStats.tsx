'use client';

import React from 'react';

interface OrderStats {
  orders: number;
  notDelivered: number;
  returned: number;
}

interface ProfileOrderStatsProps {
  stats: OrderStats;
  variant?: 'bar' | 'activity';
}

export const ProfileOrderStats: React.FC<ProfileOrderStatsProps> = ({ stats, variant = 'bar' }) => {
  if (variant === 'bar') {
    return (
      <div className="profile-card flex overflow-hidden">
        <div className="profile-stat-pill">
          <p className="text-xs text-[var(--admin-muted)] mb-1">سفارشات</p>
          <p className="text-xl font-bold text-[var(--admin-text)]">{stats.orders.toLocaleString('fa-IR')}</p>
        </div>
        <div className="profile-stat-pill">
          <p className="text-xs text-[var(--admin-muted)] mb-1">تحویل نشده</p>
          <p className="text-xl font-bold text-[var(--admin-text)]">{stats.notDelivered.toLocaleString('fa-IR')}</p>
        </div>
        <div className="profile-stat-pill">
          <p className="text-xs text-[var(--admin-muted)] mb-1">مرجوعی</p>
          <p className="text-xl font-bold text-[var(--admin-text)]">{stats.returned.toLocaleString('fa-IR')}</p>
        </div>
      </div>
    );
  }

  const items = [
    { key: 'orders', label: 'سفارش', count: stats.orders, hint: 'چندتا سفارش داشتم؟' },
    { key: 'notDelivered', label: 'تحویل نشده', count: stats.notDelivered, hint: 'چندتا سفارش تحویل نگرفتم؟' },
    { key: 'returned', label: 'مرجوعی', count: stats.returned, hint: 'چندتا سفارش مرجوعی داشتم؟' },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.key} className="profile-card p-5 flex flex-col items-center text-center">
          <div className="profile-activity-ring mb-3">{item.count.toLocaleString('fa-IR')}</div>
          <p className="font-bold text-[var(--admin-text)] mb-1">{item.label}</p>
          <p className="text-xs text-[var(--admin-muted)] leading-relaxed">{item.hint}</p>
        </div>
      ))}
    </div>
  );
};
