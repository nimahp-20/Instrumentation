'use client';

import React from 'react';
import { PROFILE_SECTION_TITLES, type ProfileSection } from './profile-menu';

interface ProfilePlaceholderSectionProps {
  section: ProfileSection;
}

const PLACEHOLDER_MESSAGES: Partial<Record<ProfileSection, string>> = {
  returns: 'درخواست تعویض و مرجوعی به‌زودی از این بخش قابل ثبت است.',
  wallet: 'تراکنش‌های کیف پول شما اینجا نمایش داده می‌شود.',
  addresses: 'مدیریت آدرس‌های ارسال به‌زودی فعال می‌شود.',
  password: 'تغییر رمز عبور از این بخش در دسترس خواهد بود.',
};

export const ProfilePlaceholderSection: React.FC<ProfilePlaceholderSectionProps> = ({ section }) => {
  return (
    <div className="profile-card p-6 sm:p-8 text-center">
      <h2 className="text-xl font-bold text-[var(--admin-text)] mb-3">{PROFILE_SECTION_TITLES[section]}</h2>
      <p className="text-[var(--admin-muted)] text-sm max-w-md mx-auto">
        {PLACEHOLDER_MESSAGES[section] ?? 'این بخش به‌زودی فعال می‌شود.'}
      </p>
    </div>
  );
};
