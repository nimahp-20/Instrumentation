'use client';

import React from 'react';
import { ProfileNavMenu } from './ProfileNavMenu';
import { ProfileWalletBar } from './ProfileWalletBar';
import type { ProfileSection } from './profile-menu';

interface ProfileUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface ProfileSidebarProps {
  user: ProfileUser | null;
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
  onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  activeSection,
  onSectionChange,
  onLogout,
}) => {
  const displayName =
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email ?? 'کاربر';
  const initial = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || '؟';

  return (
    <aside className="profile-sidebar profile-sidebar--desktop-only">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[var(--admin-text)] truncate">{displayName}</p>
          <p className="text-sm text-[var(--admin-muted)] truncate">{user?.phone || user?.email}</p>
        </div>
      </div>

      <div className="p-4">
        <ProfileWalletBar />
      </div>

      <ProfileNavMenu
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={onLogout}
      />
    </aside>
  );
};
