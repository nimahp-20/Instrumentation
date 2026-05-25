'use client';

import React from 'react';
import Link from 'next/link';
import { IconBox, IconShopping } from './ProfileIcons';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
      case 'shipped':
        return 'bg-sky-50 text-sky-900 border-sky-200/80';
      case 'pending':
        return 'bg-amber-50 text-amber-900 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'تحویل شده';
      case 'shipped':
        return 'ارسال شده';
      case 'pending':
        return 'در انتظار';
      default:
        return status;
    }
  };

  return (
    <div className="profile-card p-6 md:p-8">
      <h2 className="text-xl font-bold text-[var(--admin-text)] mb-6 flex items-center gap-2.5">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--admin-primary)] bg-sky-50 border border-sky-100">
          <IconBox className="w-5 h-5" />
        </span>
        سفارش‌های من
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-14 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-[var(--admin-muted)]">
            <IconBox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-[var(--admin-muted)] mb-6 max-w-md mx-auto">سفارش‌های شما در این بخش نمایش داده می‌شود.</p>
          <Link href="/products" className="profile-btn-primary inline-flex items-center gap-2 px-6 py-3">
            <IconShopping className="w-5 h-5" />
            شروع خرید
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[var(--admin-radius)] border border-slate-200/90 bg-slate-50/60 p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-bold text-[var(--admin-text)]">#{order.id}</h3>
                    <span className={`px-3 py-1 rounded-[10px] text-xs font-semibold border ${getStatusStyle(order.status)}`}>{getStatusText(order.status)}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--admin-muted)]">تاریخ سفارش</span>
                      <p className="font-semibold text-[var(--admin-text)] mt-0.5">{new Date(order.date).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div>
                      <span className="text-[var(--admin-muted)]">تعداد آیتم</span>
                      <p className="font-semibold text-[var(--admin-text)] mt-0.5">{order.items} عدد</p>
                    </div>
                    <div className="sm:col-span-1 col-span-2">
                      <span className="text-[var(--admin-muted)]">مبلغ کل</span>
                      <p className="font-bold text-[var(--admin-primary)] text-lg mt-0.5">{order.total.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button type="button" className="profile-btn-accent-ghost px-4 py-2 text-sm">
                    مشاهده جزئیات
                  </button>
                  {order.status === 'delivered' && (
                    <button type="button" className="px-4 py-2 text-sm font-semibold rounded-[10px] border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100/90 transition-colors">
                      سفارش مجدد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
