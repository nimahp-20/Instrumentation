'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { AdminLoadingBlock } from '@/components/admin/AdminLoading';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

interface AdminStats {
  products: number;
  categories: number;
  users: number;
  lowStock: number;
}

function MiniTrend() {
  const heights = [40, 55, 48, 70, 62, 85, 78, 92, 88, 100, 95, 82];
  return (
    <div className="flex items-end justify-between gap-1 h-28 mt-4" aria-hidden>
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm opacity-90 transition-all"
          style={{
            height: `${h}%`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 100%)`,
            minHeight: '8px',
          }}
        />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuthContext();
  const { runAsync } = useAdminLoading();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await runAsync(async () => {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || 'خطا در بارگذاری آمار');
        }
      }, 'در حال بارگذاری آمار...');
    } catch {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  }, [runAsync]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const statTiles = [
    {
      label: 'محصولات',
      value: stats?.products ?? '—',
      href: '/admin/products',
      dot: 'bg-[#a855f7]',
    },
    {
      label: 'دسته‌بندی‌ها',
      value: stats?.categories ?? '—',
      href: '/admin/categories',
      dot: 'bg-amber-400',
    },
    {
      label: 'کاربران',
      value: stats?.users ?? '—',
      href: '/admin/users',
      dot: 'bg-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">سلام، {user?.firstName}</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">به پنل مدیریت ابزارکده خوش آمدید</p>
        </div>
        <button
          type="button"
          className="admin-card px-4 py-2.5 flex items-center gap-2 text-sm text-slate-600 hover:border-[var(--admin-header)]/40 transition-colors"
        >
          <svg className="w-4 h-4 text-[var(--admin-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          جستجو
        </button>
      </div>

      {loading && (
        <div className="admin-card overflow-hidden">
          <AdminLoadingBlock message="در حال بارگذاری آمار..." />
        </div>
      )}

      {error && (
        <div className="admin-card p-4 text-red-600 text-sm border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="admin-card xl:col-span-2 p-6 text-white overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, var(--admin-header-deep) 0%, var(--admin-primary) 55%, #1864ab 100%)',
          }}
        >
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-white/85 text-sm font-medium">نمای کلی فروشگاه</p>
              <p className="text-3xl sm:text-4xl font-bold mt-2 tabular-nums">
                {stats?.products != null ? stats.products.toLocaleString('fa-IR') : '—'}{' '}
                <span className="text-lg font-semibold text-white/80">محصول فعال</span>
              </p>
              <p className="text-emerald-200 text-sm mt-2 flex items-center gap-1">
                <span className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-xs">+ مدیریت موجودی</span>
                {stats?.lowStock != null && stats.lowStock > 0 && (
                  <span className="text-amber-200">{stats.lowStock.toLocaleString('fa-IR')} کالا با موجودی کم</span>
                )}
              </p>
            </div>
            <div className="text-end">
              <p className="text-white/70 text-xs tracking-wide">هشدار موجودی</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">
                {stats?.lowStock != null ? stats.lowStock.toLocaleString('fa-IR') : '—'}
              </p>
              <p className="text-white/75 text-xs mt-1">قلم با موجودی ≤ ۵</p>
            </div>
          </div>
          <MiniTrend />
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            {statTiles.map((t) => (
              <Link key={t.label} href={t.href} className="flex items-center gap-3 rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 transition-colors">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dot}`} />
                <div>
                  <p className="text-xs text-white/75">{t.label}</p>
                  <p className="font-semibold tabular-nums">{typeof t.value === 'number' ? t.value.toLocaleString('fa-IR') : t.value}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">فعالیت اخیر</h2>
          <p className="text-sm text-[var(--admin-muted)] leading-relaxed">
            پس از اتصال ماژول‌های سفارش و گزارش، نمودار فعالیت و برنامه کاری اینجا نمایش داده می‌شود.
          </p>
          <div className="flex gap-1 h-16 items-end">
            {[35, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-slate-200 to-[var(--admin-header)]/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
          <h2 className="font-semibold text-slate-800">دسترسی سریع</h2>
          <div className="flex flex-wrap gap-2">
            {['همه', 'محصولات', 'دسته‌ها'].map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  i === 0
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
                style={i === 0 ? { background: 'var(--admin-header)' } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
            style={{ background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
          >
            مدیریت محصولات
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-colors"
          >
            مدیریت دسته‌بندی‌ها
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white bg-slate-600 hover:bg-slate-700 transition-colors"
          >
            فهرست کاربران
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            مشاهده فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
