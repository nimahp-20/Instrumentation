'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AdminLink } from '@/components/admin/AdminLink';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';
import { useAuthContext } from '@/contexts/AuthContext';

function IconDashboard() {
  return (
    <svg className="w-5 h-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg className="w-5 h-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg className="w-5 h-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="w-5 h-5 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.748-3.066 4.125 4.125 0 00-7.748 3.066 9.337 9.337 0 004.12.952 9.38 9.38 0 002.625-.372" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const navItems = [
  { href: '/admin', label: 'داشبورد', icon: IconDashboard, exact: true },
  { href: '/admin/products', label: 'محصولات', icon: IconBox },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: IconTag },
  { href: '/admin/users', label: 'کاربران', icon: IconUsers },
];

type AdminSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarContentProps = {
  onNavigate: (label?: string) => void;
  onLogout: () => void;
  initials: string;
  userName: string;
  showCloseButton?: boolean;
  onClose?: () => void;
};

function SidebarContent({
  onNavigate,
  onLogout,
  initials,
  userName,
  showCloseButton,
  onClose,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="p-5 border-b border-[var(--admin-navy-border)]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate text-sm">{userName}</p>
            <p className="text-xs text-blue-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              آنلاین
            </p>
          </div>
          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors shrink-0"
              aria-label="بستن منو"
            >
              <IconClose />
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <label className="sr-only">جستجو در منو</label>
        <div className="relative">
          <span className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-slate-400">
            <IconSearch />
          </span>
          <input
            type="search"
            placeholder="جستجو..."
            className="admin-input-search w-full py-2.5 ps-3 pe-10 text-sm outline-none focus:ring-2 focus:ring-[var(--admin-header)]/50"
            readOnly
            aria-readonly
          />
        </div>
      </div>

      <nav className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">منوی اصلی</p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : Boolean(pathname?.startsWith(item.href));

          const Icon = item.icon;

          return (
            <AdminLink
              key={item.href}
              href={item.href}
              loadingMessage={`در حال باز کردن ${item.label}...`}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }
                  : undefined
              }
            >
              <Icon />
              <span className="flex-1 text-right">{item.label}</span>
              <IconChevron />
            </AdminLink>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-[var(--admin-navy-border)] space-y-2">
        <AdminLink
          href="/"
          loadingMessage="در حال بازگشت به فروشگاه..."
          onClick={() => onNavigate()}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-sm text-slate-300 border border-[var(--admin-navy-border)] hover:bg-white/5 hover:text-white transition-colors"
        >
          بازگشت به فروشگاه
        </AdminLink>
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 rounded-[10px] text-sm font-medium text-red-300 bg-red-950/30 border border-red-900/40 hover:bg-red-900/40 transition-colors"
        >
          خروج از حساب
        </button>
        <p className="text-[10px] text-center text-slate-600 pt-1">© ابزارکده — پنل مدیریت</p>
      </div>
    </>
  );
}

function AdminMobileMenu({
  onClose,
  onLogout,
  initials,
  userName,
}: {
  onClose: () => void;
  onLogout: () => void;
  initials: string;
  userName: string;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="admin-shell admin-mobile-menu-root lg:hidden" dir="rtl" role="dialog" aria-modal="true" aria-label="منوی مدیریت">
      <button
        type="button"
        className="admin-mobile-menu-backdrop"
        onClick={onClose}
        aria-label="بستن منو"
        tabIndex={-1}
      />
      <aside
        className="admin-mobile-menu-drawer flex flex-col text-slate-100 border-e border-[var(--admin-navy-border)]"
        style={{ background: 'var(--admin-navy)' }}
      >
        <SidebarContent
          onNavigate={onClose}
          onLogout={onLogout}
          initials={initials}
          userName={userName}
          showCloseButton
          onClose={onClose}
        />
      </aside>
    </div>,
    document.body,
  );
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, adminLogout } = useAuthContext();
  const { startLoading } = useAdminLoading();

  const handleLogout = async () => {
    onMobileClose();
    startLoading('در حال خروج...');
    await adminLogout();
    router.push('/admin/login');
  };

  const initials = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || '?';
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'مدیر';

  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  return (
    <>
      <aside
        className="hidden lg:flex w-[260px] shrink-0 flex-col min-h-screen text-slate-100 border-e border-[var(--admin-navy-border)]"
        style={{ background: 'var(--admin-navy)' }}
      >
        <SidebarContent
          onNavigate={() => {}}
          onLogout={handleLogout}
          initials={initials}
          userName={userName}
        />
      </aside>

      {mobileOpen && (
        <AdminMobileMenu
          onClose={onMobileClose}
          onLogout={handleLogout}
          initials={initials}
          userName={userName}
        />
      )}
    </>
  );
}
