'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, updateProfile } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
      return;
    }

    let cancelled = false;

    (async () => {
      const profile = await updateProfile();
      if (cancelled) return;

      const serverRole = profile.success ? profile.data?.user.role : null;

      if (!profile.success || serverRole !== 'admin') {
        router.replace('/admin/login?error=unauthorized');
        return;
      }

      setVerified(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, router, pathname, updateProfile]);

  if (isLoading || (isAuthenticated && !verified)) {
    return (
      <div
        className="admin-shell min-h-screen flex items-center justify-center"
        style={{ background: 'var(--admin-bg)' }}
      >
        <div className="text-center">
          <div
            className="w-11 h-11 border-[3px] border-slate-200 border-t-[var(--admin-header)] rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-[var(--admin-muted)] text-sm">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin' || !verified) {
    return null;
  }

  return <>{children}</>;
}
