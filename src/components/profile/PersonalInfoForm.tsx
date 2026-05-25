'use client';

import React from 'react';
import { IconPencil, IconSave, IconUser, IconX } from './ProfileIcons';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface PersonalInfoFormProps {
  user: User | null;
  isEditing: boolean;
  editForm: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  editSuccess: string;
  editError: string;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EMPTY = '—';

function ReadonlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[var(--admin-muted)]">{label}</label>
      <div className="px-4 py-3 profile-field-readonly font-medium break-all">{value?.trim() ? value : EMPTY}</div>
    </div>
  );
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  isEditing,
  editForm,
  editSuccess,
  editError,
  isSubmitting,
  onEditToggle,
  onInputChange,
  onSubmit,
}) => {
  const fullName =
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.lastName || '';

  return (
    <div className="profile-card p-5 sm:p-6 md:p-8">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--admin-text)] flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--admin-primary)] bg-sky-50 border border-sky-100">
            <IconUser className="w-5 h-5" />
          </span>
          اطلاعات کاربری
        </h2>
        <button
          type="button"
          onClick={onEditToggle}
          className={
            isEditing
              ? 'profile-btn-danger-ghost px-4 py-2.5'
              : 'profile-btn-primary px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm'
          }
        >
          {isEditing ? (
            <>
              <IconX className="w-4 h-4" />
              انصراف
            </>
          ) : (
            <>
              <IconPencil className="w-4 h-4" />
              ویرایش
            </>
          )}
        </button>
      </div>

      {editSuccess && (
        <div className="mb-4 p-3.5 rounded-[10px] text-sm font-medium border border-blue-200 bg-blue-50 text-blue-900">
          {editSuccess}
        </div>
      )}
      {editError && (
        <div className="mb-4 p-3.5 rounded-[10px] text-sm font-medium border border-red-200 bg-red-50 text-red-900">
          {editError}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--admin-muted)]">نام</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 profile-input"
                placeholder="نام"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--admin-muted)]">نام خانوادگی</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 profile-input"
                placeholder="نام خانوادگی"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--admin-muted)]">ایمیل</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="w-full px-4 py-3 profile-input"
                placeholder="ایمیل"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--admin-muted)]">شماره تماس ضروری</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 profile-input"
                placeholder="شماره تماس"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <ReadonlyField label="نام و نام خانوادگی" value={fullName} />
            <ReadonlyField label="ایمیل" value={user?.email} />
            <ReadonlyField label="شماره کارت" value="" />
            <ReadonlyField label="شماره تماس ضروری" value={user?.phone} />
            <ReadonlyField label="تاریخ تولد" value="" />
            <ReadonlyField label="شماره شبا" value="" />
          </div>
        )}

        {isEditing && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={isSubmitting} className="profile-btn-primary px-6 py-3 inline-flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin shrink-0" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <IconSave className="w-5 h-5 shrink-0 opacity-95" />
                  ذخیره تغییرات
                </>
              )}
            </button>
            <button type="button" onClick={onEditToggle} className="profile-btn-ghost px-6 py-3">
              انصراف
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
