'use client';

import React from 'react';
import { IconCheckCircle, IconExclamation, IconShield, IconUser } from './ProfileIcons';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

interface ProfileHeaderProps {
  user: User | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const initial = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || '؟';

  return (
    <div className="profile-card overflow-hidden mb-6 sm:mb-8 relative">
      <div
        className="h-36 sm:h-44 relative"
        style={{
          background: 'linear-gradient(120deg, var(--admin-navy) 0%, var(--admin-navy-2) 45%, var(--admin-primary) 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgb(15_23_42/0.15)_100%)]" />
        <div className="absolute bottom-4 end-6 text-white/90 text-sm font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          حساب فعال
        </div>
      </div>

      <div className="px-5 sm:px-8 pb-8 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="relative -mt-20 sm:-mt-[4.5rem] shrink-0">
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-xl border-4 border-white"
              style={{
                background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
              }}
            >
              {initial}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-right min-w-0 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text)] mb-1.5 tracking-tight">
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
            </h1>
            <p className="text-[var(--admin-muted)] mb-5 text-base sm:text-lg truncate">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium border ${
                  user?.emailVerified
                    ? 'bg-blue-50 text-blue-800 border-blue-200/80'
                    : 'bg-amber-50 text-amber-900 border-amber-200/80'
                }`}
              >
                {user?.emailVerified ? (
                  <IconCheckCircle className="w-4 h-4 shrink-0 text-blue-600" />
                ) : (
                  <IconExclamation className="w-4 h-4 shrink-0 text-amber-600" />
                )}
                {user?.emailVerified ? 'ایمیل تأیید شده' : 'ایمیل تأیید نشده'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-sky-50 text-sky-900 border border-sky-200/80">
                {user?.role === 'admin' ? (
                  <IconShield className="w-4 h-4 shrink-0 text-[var(--admin-primary)]" />
                ) : (
                  <IconUser className="w-4 h-4 shrink-0 text-[var(--admin-primary)]" />
                )}
                {user?.role === 'admin' ? 'مدیر' : 'کاربر'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
