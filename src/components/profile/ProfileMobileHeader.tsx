'use client';

import React from 'react';
import { IconPencil } from './ProfileIcons';

interface ProfileUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface ProfileMobileHeaderProps {
  user: ProfileUser | null;
  onEdit?: () => void;
}

export const ProfileMobileHeader: React.FC<ProfileMobileHeaderProps> = ({ user, onEdit }) => {
  const displayName =
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email ?? 'کاربر';
  const initial = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || '؟';

  return (
    <div className="profile-card p-4 profile-mobile-only">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--admin-primary)] hover:underline"
        >
          <IconPencil className="w-4 h-4" />
          ویرایش
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 text-left">
            <p className="font-bold text-[var(--admin-text)] truncate">{displayName}</p>
            <p className="text-sm text-[var(--admin-muted)] truncate">{user?.phone || '—'}</p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(145deg, #fb923c 0%, #ea580c 100%)' }}
          >
            {initial}
          </div>
        </div>
      </div>
    </div>
  );
};
