'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

function AdminLoginContent() {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  if (isLoading) {
    return (
      <div
        className="admin-shell min-h-screen flex items-center justify-center"
        style={{ background: 'var(--admin-navy)' }}
      >
        <div className="w-11 h-11 border-[3px] border-white/20 border-t-[var(--admin-header)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="admin-shell min-h-screen flex flex-col lg:flex-row"
      dir="rtl"
    >
      <div
        className="lg:w-5/12 xl:w-1/2 flex flex-col justify-center px-8 py-12 text-white lg:min-h-screen"
        style={{
          background: 'linear-gradient(160deg, var(--admin-navy) 0%, var(--admin-navy-2) 45%, #0c2844 100%)',
        }}
      >
        <p className="text-[var(--admin-header)] text-sm font-semibold tracking-wide mb-2">ابزارکده</p>
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">پنل مدیریت فروشگاه</h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
          مدیریت محصولات، دسته‌بندی‌ها و آمار فروشگاه از یک داشبورد واحد و امن.
        </p>
        <div className="mt-10 flex gap-3">
          <span className="h-1 w-10 rounded-full bg-[var(--admin-header)]" />
          <span className="h-1 w-6 rounded-full bg-white/20" />
          <span className="h-1 w-6 rounded-full bg-white/20" />
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-10"
        style={{ background: 'var(--admin-bg)' }}
      >
        <AdminLoginForm />
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-shell min-h-screen flex items-center justify-center bg-[var(--admin-navy)]">
          <div className="w-11 h-11 border-[3px] border-white/20 border-t-[var(--admin-header)] rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
