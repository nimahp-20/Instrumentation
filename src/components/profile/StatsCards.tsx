'use client';

import React from 'react';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
            📧
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">ایمیل</p>
            <p className="text-lg font-bold text-gray-900 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-2xl">
            📅
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">عضویت از</p>
            <p className="text-lg font-bold text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl">
            ⏰
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">آخرین ورود</p>
            <p className="text-lg font-bold text-gray-900">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fa-IR') : 'امروز'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
