'use client';

import React from 'react';
import Link from 'next/link';
import { IconHome, IconLogout, IconShopping } from './ProfileIcons';

interface User {
  id?: string;
  role?: string;
  emailVerified?: boolean;
}

interface QuickActionsProps {
  user: User | null;
  onLogout: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="profile-card p-4 sm:p-5">
        <h3 className="text-sm font-bold text-[var(--admin-text)] mb-4">عملیات سریع</h3>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-[10px] text-white text-center transition-all shadow-sm hover:shadow-md min-h-[5.5rem]"
            style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
          >
            <IconHome className="w-6 h-6 opacity-95" />
            <span className="text-[11px] sm:text-xs font-semibold leading-tight">خانه</span>
          </Link>
          <Link
            href="/products"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-[10px] border border-sky-200 bg-sky-50/80 text-[var(--admin-primary)] hover:bg-sky-100/90 transition-colors min-h-[5.5rem]"
          >
            <IconShopping className="w-6 h-6" />
            <span className="text-[11px] sm:text-xs font-semibold leading-tight text-[var(--admin-text)]">محصولات</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-[10px] border border-red-200/90 bg-red-50/80 text-red-700 hover:bg-red-100/90 transition-colors min-h-[5.5rem]"
          >
            <IconLogout className="w-6 h-6" />
            <span className="text-[11px] sm:text-xs font-semibold leading-tight">خروج</span>
          </button>
        </div>
      </div>

      <div
        className="profile-card p-5 sm:p-6 text-white overflow-hidden relative"
        style={{
          background: 'linear-gradient(155deg, var(--admin-navy) 0%, var(--admin-navy-2) 40%, var(--admin-primary) 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06)_0%,transparent_45%)] pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative">جزئیات حساب</h3>
        <div className="space-y-3 text-sm relative">
          <div className="flex justify-between items-center gap-3 pb-2.5 border-b border-white/15">
            <span className="text-slate-300 shrink-0">نقش کاربری</span>
            <span className="font-bold text-end">{user?.role === 'admin' ? 'مدیر' : 'کاربر'}</span>
          </div>
          <div className="flex justify-between items-center gap-3 pb-2.5 border-b border-white/15">
            <span className="text-slate-300 shrink-0">وضعیت ایمیل</span>
            <span className="font-bold text-end">{user?.emailVerified ? 'تأیید شده' : 'تأیید نشده'}</span>
          </div>
          <div className="flex justify-between items-center gap-3">
            <span className="text-slate-300 shrink-0">شناسه</span>
            <span className="font-mono text-xs text-slate-200 truncate max-w-[55%] text-end">{user?.id ? `${user.id.slice(0, 10)}…` : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
