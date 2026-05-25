'use client';

import React from 'react';
import { IconChevronLeft } from './ProfileIcons';
import { PROFILE_LOGOUT_ITEM, PROFILE_MENU_ITEMS, type ProfileSection } from './profile-menu';

interface ProfileNavMenuProps {
  /** وقتی null باشد هیچ آیتمی به‌عنوان فعال نمایش داده نمی‌شود (نمای منوی موبایل) */
  activeSection?: ProfileSection | null;
  onSectionChange: (section: ProfileSection) => void;
  onLogout: () => void;
  className?: string;
}

export const ProfileNavMenu: React.FC<ProfileNavMenuProps> = ({
  activeSection = null,
  onSectionChange,
  onLogout,
  className = '',
}) => {
  return (
    <nav className={className} aria-label="منوی پروفایل">
      {PROFILE_MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection != null && item.id === activeSection;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id as ProfileSection)}
            className={`profile-nav-item ${isActive ? 'profile-nav-item--active' : ''}`}
          >
            <span className="profile-nav-icon">
              <Icon className="w-5 h-5" />
            </span>
            <span className="flex-1 text-right">{item.label}</span>
            <IconChevronLeft className="w-4 h-4 text-[var(--admin-muted)] shrink-0" aria-hidden />
          </button>
        );
      })}
      <button
        type="button"
        onClick={onLogout}
        className="profile-nav-item profile-nav-item--logout"
      >
        <span className="profile-nav-icon">
          <PROFILE_LOGOUT_ITEM.icon className="w-5 h-5" />
        </span>
        <span className="flex-1 text-right">{PROFILE_LOGOUT_ITEM.label}</span>
      </button>
    </nav>
  );
};
