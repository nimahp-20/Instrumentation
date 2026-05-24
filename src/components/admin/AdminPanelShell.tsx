'use client';

import { useCallback, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLoadingProvider } from '@/components/admin/AdminLoadingContext';
import { AdminNavigationLoadingSync } from '@/components/admin/AdminNavigationLoadingSync';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminPanelShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((open) => !open);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <AdminGuard>
      <AdminLoadingProvider>
        <AdminNavigationLoadingSync />
        <div
          className="admin-shell min-h-screen flex flex-col lg:flex-row bg-[var(--admin-bg)] text-[var(--admin-text)]"
          dir="rtl"
        >
          <AdminSidebar mobileOpen={mobileMenuOpen} onMobileClose={closeMobileMenu} />
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <AdminHeader mobileMenuOpen={mobileMenuOpen} onMenuToggle={toggleMobileMenu} />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-[1400px] mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </AdminLoadingProvider>
    </AdminGuard>
  );
}
