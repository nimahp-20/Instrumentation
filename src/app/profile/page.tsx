'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  PersonalInfoForm,
  FavoritesTab,
  OrdersTab,
  ProfileNationalIdBanner,
  ProfileOrderStats,
  ProfileRecentOrders,
  ProfileSidebar,
  ProfileMobileHeader,
  ProfileNavMenu,
  ProfilePlaceholderSection,
  ProfileWalletBar,
  type RecentOrder,
} from '@/components/profile';
import type { ProfileSection } from '@/components/profile/profile-menu';
import { IconChevronLeft } from '@/components/profile/ProfileIcons';

const PROFILE_SECTIONS: ProfileSection[] = [
  'account',
  'orders',
  'returns',
  'favorites',
  'wallet',
  'addresses',
  'password',
];

function isProfileSection(value: string | null): value is ProfileSection {
  return value != null && PROFILE_SECTIONS.includes(value as ProfileSection);
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const hasLoadedProfile = useRef(false);
  const [activeSection, setActiveSection] = useState<ProfileSection>('account');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !hasLoadedProfile.current) {
      hasLoadedProfile.current = true;
      updateProfile();
    }
  }, [isAuthenticated, updateProfile]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditError('');
    setEditSuccess('');
    if (!isEditing && user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError('');
    setEditSuccess('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        setEditSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
        setIsEditing(false);
        await updateProfile();
      } else {
        setEditError(data.message || 'خطا در به‌روزرسانی اطلاعات');
      }
    } catch {
      setEditError('خطای شبکه - لطفاً دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionFromUrl = searchParams.get('section');
  const mobileSection = isProfileSection(sectionFromUrl) ? sectionFromUrl : null;
  const showMobileSection = mobileSection != null;

  useEffect(() => {
    if (mobileSection) {
      setActiveSection(mobileSection);
      if (mobileSection !== 'account') {
        setIsEditing(false);
      }
    }
  }, [mobileSection]);

  const handleSectionChange = (section: ProfileSection) => {
    setActiveSection(section);
    router.push(`/profile?section=${section}`);
    if (section !== 'account') {
      setIsEditing(false);
    }
  };

  const handleMobileBack = () => {
    router.push('/profile');
    setIsEditing(false);
  };

  const handleMobileEdit = () => {
    setIsEditing(true);
    handleSectionChange('account');
  };

  const favoriteProducts = [
    { id: 1, name: 'دریل برقی حرفه‌ای', price: 2500000, image: '/product-drill.jpg', category: 'ابزار برقی' },
    { id: 2, name: 'آچار تخت چند منظوره', price: 450000, image: '/product-wrench.jpg', category: 'ابزار دستی' },
    { id: 3, name: 'کلاه ایمنی ساختمانی', price: 180000, image: '/product-helmet.jpg', category: 'تجهیزات ایمنی' },
  ];

  const orders = [
    { id: 'JW0193027', date: '2026-05-14', status: 'delivered' as const, total: 2078530, items: 1 },
    { id: 'ORD-002', date: '2024-01-10', status: 'shipped' as const, total: 890000, items: 2 },
    { id: 'ORD-003', date: '2024-01-05', status: 'pending' as const, total: 1200000, items: 1 },
  ];

  const orderStats = useMemo(
    () => ({
      orders: orders.length,
      notDelivered: orders.filter((o) => o.status !== 'delivered').length,
      returned: 0,
    }),
    [orders]
  );

  const recentOrders: RecentOrder[] = orders.map((o) => ({
    id: o.id,
    date: o.date,
    total: o.total,
    status: o.status,
  }));

  const accountInfoForm = (
    <PersonalInfoForm
      user={user}
      isEditing={isEditing}
      editForm={editForm}
      editSuccess={editSuccess}
      editError={editError}
      isSubmitting={isSubmitting}
      onEditToggle={handleEditToggle}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );

  const renderSectionContent = (mobile = false) => {
    switch (activeSection) {
      case 'account':
        if (mobile) {
          return (
            <div className="space-y-4">
              <ProfileNationalIdBanner />
              {accountInfoForm}
            </div>
          );
        }
        return (
          <div className="space-y-4 sm:space-y-5">
            <ProfileNationalIdBanner />
            {accountInfoForm}
            <ProfileRecentOrders orders={recentOrders} />
            <div>
              <h2 className="text-lg font-bold text-[var(--admin-text)] mb-4 px-0.5">فعالیت‌ها</h2>
              <ProfileOrderStats stats={orderStats} variant="activity" />
            </div>
          </div>
        );
      case 'orders':
        return <OrdersTab orders={orders} />;
      case 'favorites':
        return <FavoritesTab favoriteProducts={favoriteProducts} />;
      case 'returns':
      case 'wallet':
      case 'addresses':
      case 'password':
        return <ProfilePlaceholderSection section={activeSection} />;
      default:
        return null;
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="profile-shell min-h-[50vh] flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="text-center px-4">
          <div
            className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'rgb(224 242 254)', borderTopColor: 'var(--admin-primary)' }}
          />
          <p className="text-[var(--admin-muted)] font-medium">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-shell min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* ─── موبایل: نمای کلی ─── */}
        {!showMobileSection && (
          <div className="profile-mobile-only space-y-4 mb-4">
            <ProfileMobileHeader user={user} onEdit={handleMobileEdit} />
            <ProfileOrderStats stats={orderStats} variant="bar" />
            <ProfileNationalIdBanner />
            <ProfileWalletBar compact />
            <div className="profile-card overflow-hidden">
              <ProfileNavMenu
                activeSection={null}
                onSectionChange={handleSectionChange}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* ─── موبایل: محتوای بخش ─── */}
        {showMobileSection && (
          <div className="profile-mobile-only space-y-4 mb-4">
            <button
              type="button"
              onClick={handleMobileBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--admin-primary)] mb-1"
            >
              <IconChevronLeft className="w-5 h-5" />
              بازگشت
            </button>
            {renderSectionContent(true)}
          </div>
        )}

        {/* ─── دسکتاپ: سایدبار + محتوا ─── */}
        <div className="profile-layout">
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={handleLogout}
          />
          <main className="min-w-0 space-y-4 sm:space-y-5">{renderSectionContent()}</main>
        </div>
      </div>
    </div>
  );
}

function ProfilePageFallback() {
  return (
    <div className="profile-shell min-h-[50vh] flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="text-center px-4">
        <div
          className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'rgb(224 242 254)', borderTopColor: 'var(--admin-primary)' }}
        />
        <p className="text-[var(--admin-muted)] font-medium">در حال بارگذاری پروفایل...</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageFallback />}>
      <ProfilePageContent />
    </Suspense>
  );
}
