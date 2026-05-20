import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
};

export const LoadingScreen: React.FC<{ message?: string; variant?: 'dark' | 'light' }> = ({
  message = 'در حال بارگذاری...',
  variant = 'dark',
}) => {
  if (variant === 'dark') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6">
            <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="70" className="animate-pulse" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-medium">{message}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl border border-white/30 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="60" className="animate-pulse" />
          </svg>
        </div>
        <p className="text-gray-800 font-semibold">{message}</p>
      </div>
    </div>
  );
};
