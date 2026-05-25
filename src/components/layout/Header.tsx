'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui';
import { AuthModal } from '../auth/AuthModal';
import { useAuthContext } from '@/contexts/AuthContext';
import type { User } from '@/hooks/useAuth';
import { useGlobalSearch } from '@/hooks/useApi';
import { IssueManager, SystemIssue, getIssuesForEnvironment, getHighestSeverity } from '@/lib/issue-manager';
import {
  CategoriesMegaMenuTrigger,
  CategoriesMegaMenuPanel,
} from '@/components/layout/CategoriesMegaMenu';

// Notification types
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const SITE_NAV_AFTER_CATEGORIES = [
  { href: '/products', label: 'محصولات' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس' },
] as const;

type GlobalSearchResults = {
  categories: Array<{ slug: string; name: string; productCount?: number }>;
  products: Array<{ slug: string; name: string; price?: number }>;
};

function navIsActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SearchResultsPanel: React.FC<{
  loading: boolean;
  results: GlobalSearchResults;
  query: string;
  onNavigate?: () => void;
  maxHeightClass?: string;
}> = ({ loading, results, query, onNavigate, maxHeightClass = 'max-h-96' }) => {
  if (query.trim().length < 2) return null;

  return (
    <div className={`header-search-panel ${maxHeightClass} overflow-y-auto`}>
      {loading ? (
        <div className="px-4 py-3 text-sm text-[var(--text-muted)]">در حال جستجو...</div>
      ) : (
        <>
          {results.categories.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-semibold text-[var(--text-muted)]">دسته‌بندی‌ها</div>
              {results.categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="header-search-hit"
                  onClick={onNavigate}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">{c.name}</div>
                    <div className="text-xs text-[var(--text-muted)] truncate">{c.productCount} محصول</div>
                  </div>
                  <svg className="w-4 h-4 text-[var(--text-muted)] ms-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
          {results.products.length > 0 && (
            <div className="py-2 border-t border-[var(--border)]">
              <div className="px-4 py-1 text-xs font-semibold text-[var(--text-muted)]">محصولات</div>
              {results.products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="header-search-hit"
                  onClick={onNavigate}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">{p.name}</div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {p.price?.toLocaleString?.('fa-IR')} تومان
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-[var(--text-muted)] ms-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
          {results.categories.length === 0 && results.products.length === 0 && (
            <div className="px-4 py-3 text-sm text-[var(--text-muted)]">نتیجه‌ای یافت نشد</div>
          )}
        </>
      )}
    </div>
  );
};

// User dropdown component
const UserDropdown: React.FC<{
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}> = ({ user, isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute end-0 mt-2 w-64 card-base py-2 z-50">
      {/* User info header */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <Link
          href="/profile"
          className="flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          پروفایل من
        </Link>
        <Link
          href="/orders"
          className="flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          سفارشات من
        </Link>
        <Link
          href="/wishlist"
          className="flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          لیست علاقه‌مندی‌ها
        </Link>
        <Link
          href="/settings"
          className="flex items-center px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          تنظیمات
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-[var(--border)] py-1">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          خروج از حساب
        </button>
      </div>
    </div>
  );
};

// Notifications dropdown component
const NotificationsDropdown: React.FC<{
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}> = ({ notifications, isOpen, onClose, onMarkAsRead }) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute end-0 mt-2 w-72 sm:w-80 card-base py-2 z-50 max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">اعلانات</h3>
          {unreadCount > 0 && (
            <Badge size="sm" className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
            <svg className="w-8 h-8 mx-auto mb-2 text-[var(--border-strong)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            هیچ اعلان جدیدی وجود ندارد
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer ${
                !notification.read ? 'bg-[var(--primary-muted)] border-s-2 border-[var(--primary)]' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-blue-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-[var(--info)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{notification.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{notification.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(notification.timestamp).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2">
          <Link
            href="/notifications"
            className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
            onClick={onClose}
          >
            مشاهده همه اعلانات
          </Link>
        </div>
      )}
    </div>
  );
};

// Header Component
export const Header: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab] = useState<'login' | 'register'>('login');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemIssues, setSystemIssues] = useState<SystemIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { results: globalResults, loading: globalLoading } = useGlobalSearch(searchQuery, { limit: 6, debounceMs: 250 });
  
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthContext();

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  const openMegaMenu = useCallback(() => {
    if (megaMenuCloseTimer.current) {
      clearTimeout(megaMenuCloseTimer.current);
      megaMenuCloseTimer.current = null;
    }
    setIsMegaMenuOpen(true);
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
  }, []);

  const closeMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false);
  }, []);

  const scheduleMegaMenuClose = useCallback(() => {
    if (megaMenuCloseTimer.current) {
      clearTimeout(megaMenuCloseTimer.current);
    }
    megaMenuCloseTimer.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      megaMenuCloseTimer.current = null;
    }, 200);
  }, []);

  const cancelMegaMenuClose = useCallback(() => {
    if (megaMenuCloseTimer.current) {
      clearTimeout(megaMenuCloseTimer.current);
      megaMenuCloseTimer.current = null;
    }
  }, []);

  // Load sample notifications and issues
  useEffect(() => {
    // Sample notifications
    setNotifications([
      {
        id: '1',
        type: 'success',
        title: 'سفارش شما ارسال شد',
        message: 'سفارش شماره #12345 با موفقیت ارسال شد',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'موجودی کم',
        message: 'محصول "دریل برقی" در حال تمام شدن است',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: 'تخفیف ویژه',
        message: 'تخفیف ۲۰٪ برای تمام محصولات برقی',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      }
    ]);

    // Load sample issues using IssueManager (commented out for production)
    // IssueManager.loadSampleIssues();
    setSystemIssues(getIssuesForEnvironment());
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown') && !target.closest('.notifications-dropdown')) {
        setIsUserDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserIconClick = () => {
    setIsSearchOpen(false);
    if (isAuthenticated) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
      setIsNotificationsOpen(false);
    } else {
      setIsAuthModalOpen(true);
      setIsUserDropdownOpen(false);
      setIsNotificationsOpen(false);
    }
  };

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
      // Add logout notification
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'info',
        title: 'خروج موفق',
        message: 'شما با موفقیت از حساب کاربری خود خارج شدید',
        timestamp: new Date(),
        read: false
      }, ...prev]);
    } catch (error) {
      console.error('Logout error:', error);
      // Add error notification
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'error',
        title: 'خطا در خروج',
        message: 'خطایی در خروج از حساب کاربری رخ داد',
        timestamp: new Date(),
        read: false
      }, ...prev]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
    <header
      className={`sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-[0_1px_3px_0_rgb(15_23_42_/_0.06)]${isMegaMenuOpen ? ' header--mega-open' : ''}`}
      onMouseEnter={cancelMegaMenuClose}
      onMouseLeave={scheduleMegaMenuClose}
    >
      {/* Issues Banner */}
      {systemIssues.length > 0 && (
        <div className={`border-b ${
          getHighestSeverity() === 'critical'
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
            : getHighestSeverity() === 'high'
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
            : 'bg-gradient-to-l from-[var(--primary-muted)] to-[var(--surface-muted)] border-[var(--primary)]/25'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse min-w-0 flex-1">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-500' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-500'
                    : 'text-[var(--primary)]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className={`text-xs sm:text-sm font-medium truncate ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-800' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-800'
                    : 'text-blue-900'
                }`}>
                  {process.env.NODE_ENV === 'development' ? 'مشکلات سیستم:' : 'اطلاعیه مهم:'}
                </span>
                <span className={`text-xs sm:text-sm truncate ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-700' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-700'
                    : 'text-blue-800'
                }`}>
                  {systemIssues[0].title}
                </span>
                {systemIssues.length > 1 && (
                  <span className={`text-xs flex-shrink-0 ${
                    getHighestSeverity() === 'critical'
                      ? 'text-red-600' 
                      : getHighestSeverity() === 'high'
                      ? 'text-yellow-600'
                      : 'text-blue-700'
                  }`}>
                    +{systemIssues.length - 1}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  IssueManager.clearAllIssues();
                  setSystemIssues([]);
                }}
                className={`flex-shrink-0 mr-2 transition-colors ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-500 hover:text-red-700' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-500 hover:text-yellow-700'
                    : 'text-[var(--primary)] hover:text-[var(--primary-hover)]'
                }`}
                title="بستن"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-muted)] ring-1 ring-[var(--primary)]/20 transition group-hover:ring-[var(--primary)]/40">
                <Image
                  src="/logo.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  aria-hidden
                />
              </span>
              <span className="text-base sm:text-lg font-bold text-[var(--text-primary)] hidden sm:inline tracking-tight">
                فروشگاه ابزار
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5 shrink-0 ms-2 xl:ms-4" aria-label="ناوبری اصلی">
            <Link
              href="/"
              className={`header-nav-link ${navIsActive(pathname, '/') ? 'header-nav-link--active' : ''}`}
              aria-current={navIsActive(pathname, '/') ? 'page' : undefined}
              onMouseEnter={closeMegaMenu}
            >
              خانه
            </Link>
            <CategoriesMegaMenuTrigger isOpen={isMegaMenuOpen} onOpen={openMegaMenu} />
            {SITE_NAV_AFTER_CATEGORIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header-nav-link ${navIsActive(pathname, item.href) ? 'header-nav-link--active' : ''}`}
                aria-current={navIsActive(pathname, item.href) ? 'page' : undefined}
                onMouseEnter={closeMegaMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md mx-3 lg:mx-6 hidden md:block min-w-0">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات و دسته‌بندی‌ها..."
                className="header-search-input"
                aria-label="جستجو"
              />
              <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 start-0 ps-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="پاک کردن جستجو"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <SearchResultsPanel
                loading={globalLoading}
                results={globalResults}
                query={searchQuery}
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="header-icon-btn header-mobile-only"
              aria-label={isSearchOpen ? 'بستن جستجو' : 'باز کردن جستجو'}
              aria-expanded={isSearchOpen}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/wishlist" className="header-icon-btn relative hidden sm:inline-flex" title="علاقه‌مندی‌ها">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link href="/cart" className="header-icon-btn relative hidden sm:inline-flex" title="سبد خرید" aria-label="سبد خرید">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 8h12l-1.2 10.5a1.5 1.5 0 01-1.49 1.35H8.69a1.5 1.5 0 01-1.49-1.35L6 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 8V6a3 3 0 016 0v2" />
              </svg>
            </Link>

            <div className="relative notifications-dropdown hidden lg:block">
              <button
                type="button"
                onClick={handleNotificationsClick}
                className="header-icon-btn relative"
                title="اعلانات"
                aria-label="اعلانات"
                aria-expanded={isNotificationsOpen}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadNotificationsCount > 0 && (
                  <Badge size="sm" className="absolute -top-1 -end-1 bg-red-500 text-white animate-pulse">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </button>
              <NotificationsDropdown
                notifications={notifications}
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAsRead={handleMarkAsRead}
              />
            </div>

            <div className="relative user-dropdown hidden lg:block">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleUserIconClick}
                  className="flex items-center gap-2 p-1.5 sm:p-2 rounded-[var(--radius-md)] hover:bg-[var(--surface-muted)] transition-colors"
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-sm ring-2 ring-[var(--primary-light)]">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-start min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user?.firstName || 'کاربر'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {user?.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </p>
                  </div>
                  <svg className="hidden lg:block w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUserIconClick}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
                  title="ورود / ثبت نام"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:inline">ورود</span>
                </button>
              )}
              <UserDropdown
                user={user}
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                onLogout={handleLogout}
              />
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-t border-[var(--border)] bg-[var(--surface-muted)]/30">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات و دسته‌بندی‌ها..."
                className="header-search-input"
                autoFocus
                aria-label="جستجو"
              />
              <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 start-0 ps-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="پاک کردن جستجو"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <SearchResultsPanel
                loading={globalLoading}
                results={globalResults}
                query={searchQuery}
                onNavigate={() => setIsSearchOpen(false)}
                maxHeightClass="max-h-[70vh]"
              />
            </div>
          </div>
        )}
      </div>

      {isMegaMenuOpen && (
        <div className="hidden lg:block">
          <CategoriesMegaMenuPanel onClose={closeMegaMenu} />
        </div>
      )}
    </header>

    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      defaultTab={authModalTab}
    />
    </>
  );
};


