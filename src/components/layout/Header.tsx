'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '../ui';
import { AuthModal } from '../auth/AuthModal';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalSearch } from '@/hooks/useApi';
import { IssueManager, SystemIssue, getIssuesForEnvironment, getHighestSeverity } from '@/lib/issue-manager';

// Notification types
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// User dropdown component
const UserDropdown: React.FC<{
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}> = ({ user, isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
      {/* User info header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <Link
          href="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          پروفایل من
        </Link>
        <Link
          href="/orders"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          سفارشات من
        </Link>
        <Link
          href="/wishlist"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          لیست علاقه‌مندی‌ها
        </Link>
        <Link
          href="/settings"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
      <div className="border-t border-gray-100 py-1">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">اعلانات</h3>
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
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            هیچ اعلان جدیدی وجود ندارد
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
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
        <div className="border-t border-gray-100 px-4 py-2">
          <Link
            href="/notifications"
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            onClick={onClose}
          >
            مشاهده همه اعلانات
          </Link>
        </div>
      )}
    </div>
  );
};

// Mobile Menu Component
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
  onShowAuthModal: () => void;
}> = ({ isOpen, onClose, isAuthenticated, user, onLogout, onShowAuthModal }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900">منو</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Section */}
        {isAuthenticated && user ? (
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-blue-100 truncate">{user?.email}</p>
              </div>
            </div>
            <Link href="/profile" onClick={onClose}>
              <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                مشاهده پروفایل
              </Button>
            </Link>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <p className="text-sm text-gray-600 mb-3">برای دسترسی به امکانات بیشتر وارد شوید</p>
            <button
              onClick={() => {
                onClose();
                onShowAuthModal();
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold"
            >
              ورود / ثبت نام
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="py-4">
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">صفحه اصلی</span>
          </Link>
          
          <Link
            href="/products"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">محصولات</span>
          </Link>

          <Link
            href="/about"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">درباره ما</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">تماس با ما</span>
          </Link>

          {isAuthenticated && (
            <>
              <div className="my-2 border-t border-gray-200" />
              
              <Link
                href="/orders"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">سفارشات من</span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">لیست علاقه‌مندی‌ها</span>
              </Link>
            </>
          )}
        </nav>

        {/* Logout Button */}
        {isAuthenticated && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج از حساب
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Header Component
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemIssues, setSystemIssues] = useState<SystemIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { results: globalResults, loading: globalLoading } = useGlobalSearch(searchQuery, { limit: 6, debounceMs: 250 });
  
  const { user, isAuthenticated, logout } = useAuthContext();

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
      setIsNotificationsOpen(false);
    } else {
      setIsAuthModalOpen(true);
      setIsUserDropdownOpen(false);
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Issues Banner */}
      {systemIssues.length > 0 && (
        <div className={`border-b ${
          getHighestSeverity() === 'critical'
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
            : getHighestSeverity() === 'high'
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse min-w-0 flex-1">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-500' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className={`text-xs sm:text-sm font-medium truncate ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-800' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}>
                  {process.env.NODE_ENV === 'development' ? 'مشکلات سیستم:' : 'اطلاعیه مهم:'}
                </span>
                <span className={`text-xs sm:text-sm truncate ${
                  getHighestSeverity() === 'critical'
                    ? 'text-red-700' 
                    : getHighestSeverity() === 'high'
                    ? 'text-yellow-700'
                    : 'text-blue-700'
                }`}>
                  {systemIssues[0].title}
                </span>
                {systemIssues.length > 1 && (
                  <span className={`text-xs flex-shrink-0 ${
                    getHighestSeverity() === 'critical'
                      ? 'text-red-600' 
                      : getHighestSeverity() === 'high'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
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
                    : 'text-blue-500 hover:text-blue-700'
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
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <Image
                src="/logo.svg"
                alt="فروشگاه ابزار"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-base sm:text-xl font-bold text-gray-900 hidden xs:inline">فروشگاه ابزار</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-900"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="پاک کردن جستجو"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                  {globalLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">در حال جستجو...</div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {/* Categories */}
                      {globalResults.categories.length > 0 && (
                        <div className="py-2">
                          <div className="px-4 py-1 text-xs font-semibold text-gray-500">دسته‌بندی‌ها</div>
                          {globalResults.categories.map((c) => (
                            <Link key={c.slug} href={`/categories/${c.slug}`} className="flex items-center px-4 py-2 hover:bg-gray-50">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                                <div className="text-xs text-gray-500 truncate">{c.productCount} محصول</div>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Products */}
                      {globalResults.products.length > 0 && (
                        <div className="py-2 border-t border-gray-100">
                          <div className="px-4 py-1 text-xs font-semibold text-gray-500">محصولات</div>
                          {globalResults.products.map((p) => (
                            <Link key={p.slug} href={`/products/${p.slug}`} className="flex items-center px-4 py-2 hover:bg-gray-50">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                                <div className="text-xs text-gray-500 truncate">{p.price?.toLocaleString?.('fa-IR')} تومان</div>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}

                      {globalResults.categories.length === 0 && globalResults.products.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">نتیجه‌ای یافت نشد</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist - Hidden on small mobile */}
            <button className="hidden sm:flex relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <Badge size="sm" className="absolute -top-1 -right-1 scale-75 sm:scale-100">0</Badge>
            </button>

            {/* Cart - Hidden on small mobile */}
            <button className="hidden sm:flex relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <Badge size="sm" className="absolute -top-1 -right-1 scale-75 sm:scale-100">0</Badge>
            </button>

            {/* Notifications - Desktop Only */}
            <div className="relative notifications-dropdown hidden lg:block">
              <button
                onClick={handleNotificationsClick}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                title="اعلانات"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                {unreadNotificationsCount > 0 && (
                  <Badge size="sm" className="absolute -top-1 -right-1 bg-red-500 text-white animate-pulse">
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

            {/* User Menu - Desktop Only */}
            <div className="relative user-dropdown hidden md:block">
              {isAuthenticated ? (
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'کاربر'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </p>
                  </div>
                  <svg className="hidden lg:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={handleUserIconClick}
                  className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title="ورود / ثبت نام"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">ورود</span>
                </button>
              )}
              <UserDropdown
                user={user}
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                onLogout={handleLogout}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات و دسته‌بندی‌ها..."
                className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-900"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="پاک کردن جستجو"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden max-h-[70vh] overflow-y-auto">
                  {globalLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">در حال جستجو...</div>
                  ) : (
                    <>
                      {globalResults.categories.length > 0 && (
                        <div className="py-2">
                          <div className="px-4 py-1 text-xs font-semibold text-gray-500">دسته‌بندی‌ها</div>
                          {globalResults.categories.map((c) => (
                            <Link key={c.slug} href={`/categories/${c.slug}`} className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsSearchOpen(false)}>
                              <div className="text-sm font-medium text-gray-900">{c.name}</div>
                              <div className="text-xs text-gray-500">{c.productCount} محصول</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {globalResults.products.length > 0 && (
                        <div className="py-2 border-t border-gray-100">
                          <div className="px-4 py-1 text-xs font-semibold text-gray-500">محصولات</div>
                          {globalResults.products.map((p) => (
                            <Link key={p.slug} href={`/products/${p.slug}`} className="block px-4 py-2.5 hover:bg-gray-50" onClick={() => setIsSearchOpen(false)}>
                              <div className="text-sm font-medium text-gray-900">{p.name}</div>
                              <div className="text-xs text-gray-500">{p.price?.toLocaleString?.('fa-IR')} تومان</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {globalResults.categories.length === 0 && globalResults.products.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">نتیجه‌ای یافت نشد</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onShowAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};
