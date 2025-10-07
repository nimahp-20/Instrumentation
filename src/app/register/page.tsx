'use client';

import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  const handleSuccess = () => {
    // Redirect to dashboard or home page
    window.location.href = '/';
  };

  const handleError = (error: string) => {
    // You can show a toast notification here
    alert(error);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm 
        mode="register" 
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
