'use client';

import React from 'react';
import { IconInfo } from './ProfileIcons';

interface ProfileWalletBarProps {
  balance?: number;
  compact?: boolean;
}

export const ProfileWalletBar: React.FC<ProfileWalletBarProps> = ({ balance = 0, compact = false }) => {
  const formatted = balance.toLocaleString('fa-IR');

  if (compact) {
    return (
      <div className="profile-wallet-box px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--admin-primary)]">
          اعتبار کیف پول: <span className="text-[var(--admin-text)]">{formatted} تومان</span>
        </p>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors">
          <IconInfo className="w-4 h-4" />
          راهنمای استفاده
        </button>
      </div>
    );
  }

  return (
    <div className="profile-wallet-box p-4">
      <p className="text-sm font-bold text-[var(--admin-primary)] mb-2">
        اعتبار کیف پول: {formatted} تومان
      </p>
      <button type="button" className="text-xs font-semibold text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors inline-flex items-center gap-1">
        راهنمای استفاده از کیف پول
      </button>
    </div>
  );
};
