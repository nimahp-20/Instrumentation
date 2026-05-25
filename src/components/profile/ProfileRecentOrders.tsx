'use client';

import React from 'react';
import Link from 'next/link';
import { IconDocument, IconTruck } from './ProfileIcons';

export interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'shipped' | 'pending';
  paymentStatus?: string;
  deliveryLabel?: string;
}

interface ProfileRecentOrdersProps {
  orders: RecentOrder[];
}

const statusLabels: Record<RecentOrder['status'], string> = {
  delivered: 'تحویل شده به مشتری',
  shipped: 'در حال ارسال',
  pending: 'در انتظار پردازش',
};

export const ProfileRecentOrders: React.FC<ProfileRecentOrdersProps> = ({ orders }) => {
  const latest = orders.slice(0, 1);

  return (
    <div className="profile-card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-[var(--admin-text)] mb-4">آخرین سفارشات</h2>

      {latest.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)] py-6 text-center">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div>
          {latest.map((order) => (
            <div key={order.id} className="profile-order-row">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-bold text-[var(--admin-text)]">#{order.id}</span>
                <span className="profile-badge-success">{order.paymentStatus ?? 'پرداخت موفق'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[var(--admin-muted)]">
                  <span>
                    تاریخ: <strong className="text-[var(--admin-text)]">{new Date(order.date).toLocaleDateString('fa-IR')}</strong>
                  </span>
                  <span>
                    مبلغ: <strong className="text-[var(--admin-primary)]">{order.total.toLocaleString('fa-IR')} تومان</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[var(--admin-text)] font-medium">
                    <IconTruck className="w-4 h-4 text-[var(--admin-primary)]" />
                    {order.deliveryLabel ?? statusLabels[order.status]}
                  </span>
                  <button type="button" className="p-2 rounded-lg border border-slate-200 text-[var(--admin-muted)] hover:text-[var(--admin-primary)] hover:border-sky-200 transition-colors" aria-label="جزئیات سفارش">
                    <IconDocument className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <Link href="#" className="inline-block mt-4 text-sm font-semibold text-[var(--admin-primary)] hover:underline">
          مشاهده همه موارد
        </Link>
      )}
    </div>
  );
};
