'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      updateProfile();
    }
  }, [isAuthenticated, updateProfile]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-600">در حال بارگذاری پروفایل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {user?.firstName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">پروفایل کاربری</h1>
            <p className="text-sm text-gray-500">اطلاعات حساب و تنظیمات شما</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات شخصی</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">نام:</span><span className="font-medium text-gray-900">{user?.firstName || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">نام خانوادگی:</span><span className="font-medium text-gray-900">{user?.lastName || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ایمیل:</span><span className="font-medium text-gray-900">{user?.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">شماره تماس:</span><span className="font-medium text-gray-900">{user?.phone || '-'}</span></div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">جزئیات حساب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">نقش:</span><span className="font-medium text-gray-900">{user?.role}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تأیید ایمیل:</span><span className="font-medium text-gray-900">{user?.emailVerified ? 'بله' : 'خیر'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">آخرین ورود:</span><span className="font-medium text-gray-900">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fa-IR') : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ایجاد حساب:</span><span className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-'}</span></div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-gray-100 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">بازگشت به خانه</Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-800">مشاهده محصولات</Link>
        </div>
      </div>
    </div>
  );
}


