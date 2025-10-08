'use client';

import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
  const handleSuccess = () => {
    // Check if there's a redirect URL stored (from auth expiration)
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    
    if (redirectUrl) {
      // Clear the stored redirect URL
      sessionStorage.removeItem('redirectAfterLogin');
      // Redirect back to the original page
      window.location.href = redirectUrl;
    } else {
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const handleError = (error: string) => {
    // You can show a toast notification here
    alert(error);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm 
        mode="login" 
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
