'use client';

import React from 'react';
import { IconCalendar, IconClock, IconEnvelope } from './ProfileIcons';

interface User {
  email?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface StatsCardsProps {
  user: User | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
      <div className="profile-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-primary)]"
            style={{ background: 'rgb(224 242 254 / 0.9)' }}
          >
            <IconEnvelope className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--admin-muted)] mb-0.5">ایمیل</p>
            <p className="text-base sm:text-lg font-bold text-[var(--admin-text)] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-blue-600"
            style={{ background: 'rgb(220 252 231 / 0.9)' }}
          >
            <IconCalendar className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--admin-muted)] mb-0.5">عضویت از</p>
            <p className="text-base sm:text-lg font-bold text-[var(--admin-text)]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-purple)]"
            style={{ background: 'rgb(243 232 255 / 0.9)' }}
          >
            <IconClock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--admin-muted)] mb-0.5">آخرین ورود</p>
            <p className="text-base sm:text-lg font-bold text-[var(--admin-text)]">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fa-IR') : 'امروز'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
