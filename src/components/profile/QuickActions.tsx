'use client';

import React from 'react';
import Link from 'next/link';

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
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">عملیات سریع</h3>
        <div className="grid grid-cols-3 gap-2">
          <Link 
            href="/"
            className="flex flex-col items-center p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md group"
          >
            <span className="text-lg mb-1">🏠</span>
            <span className="text-xs font-medium">خانه</span>
          </Link>
          <Link 
            href="/products"
            className="flex flex-col items-center p-3 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all group"
          >
            <span className="text-lg mb-1">🛍️</span>
            <span className="text-xs font-medium">محصولات</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex flex-col items-center p-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all group"
          >
            <span className="text-lg mb-1">🚪</span>
            <span className="text-xs font-medium">خروج</span>
          </button>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">جزئیات حساب</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-white/20">
            <span className="text-blue-100">نقش کاربری:</span>
            <span className="font-bold">{user?.role === 'admin' ? 'مدیر' : 'کاربر'}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/20">
            <span className="text-blue-100">وضعیت ایمیل:</span>
            <span className="font-bold">{user?.emailVerified ? 'تأیید شده' : 'تأیید نشده'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-100">شناسه کاربری:</span>
            <span className="font-mono text-xs">{user?.id?.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
