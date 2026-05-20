'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLoadingProvider } from '@/components/admin/AdminLoadingContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLoadingProvider>
        <div
          className="admin-shell min-h-screen flex flex-col-reverse lg:flex-row bg-[var(--admin-bg)] text-[var(--admin-text)]"
          dir="rtl"
        >
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 min-h-0 lg:min-h-screen">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-[1400px] mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </AdminLoadingProvider>
    </AdminGuard>
  );
}
