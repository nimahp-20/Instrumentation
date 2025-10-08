'use client';

import React from 'react';

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

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  isEditing,
  editForm,
  editSuccess,
  editError,
  isSubmitting,
  onEditToggle,
  onInputChange,
  onSubmit
}) => {
  return (
    <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          اطلاعات شخصی
        </h2>
        <button
          onClick={onEditToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isEditing
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {isEditing ? '❌ انصراف' : '✏️ ویرایش'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {editSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-sm">
          {editSuccess}
        </div>
      )}
      {editError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg text-sm">
          {editError}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">نام</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="نام خود را وارد کنید"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 font-medium">
                {user?.firstName || '-'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">نام خانوادگی</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 font-medium">
                {user?.lastName || '-'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">آدرس ایمیل</label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="ایمیل خود را وارد کنید"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 font-medium">
                {user?.email}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">شماره تماس</label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="شماره تماس خود را وارد کنید"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 font-medium">
                {user?.phone || 'ثبت نشده'}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <span>💾</span>
                  ذخیره تغییرات
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onEditToggle}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              انصراف
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
