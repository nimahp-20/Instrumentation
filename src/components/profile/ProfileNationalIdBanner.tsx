'use client';

import React from 'react';
import { IconShield } from './ProfileIcons';

export const ProfileNationalIdBanner: React.FC = () => {
  return (
    <div className="profile-national-banner p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-primary)] bg-white border border-sky-200">
          <IconShield className="w-5 h-5" />
        </span>
        <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-[var(--admin-text)] font-medium">
          برای ساده‌سازی فرآیند خرید، با ثبت کد ملی اطلاعات کاربری خود را تکمیل کنید.
        </p>
      </div>
      <button type="button" className="profile-btn-primary px-5 py-2.5 text-sm shrink-0 self-start sm:self-center">
        ثبت کد ملی
      </button>
    </div>
  );
};
