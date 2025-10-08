'use client';

import React from 'react';

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
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6 relative">
      {/* Cover with gradient */}
      <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 md:px-8 pb-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar - positioned to overlap the header */}
          <div className="relative -mt-20 sm:-mt-16">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center sm:text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email}
            </h1>
            <p className="text-gray-600 mb-4 text-lg">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                user?.emailVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.emailVerified ? '✓ ایمیل تأیید شده' : '⚠ ایمیل تأیید نشده'}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user?.role === 'admin' ? '👑 مدیر' : '👤 کاربر'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
