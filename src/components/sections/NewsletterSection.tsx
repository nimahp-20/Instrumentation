'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface NewsletterSectionProps {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
  title, 
  description, 
  placeholder, 
  buttonText,
  onSubmit,
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Call custom onSubmit if provided, otherwise use default API
      if (onSubmit) {
        await onSubmit(email);
        setMessage({ type: 'success', text: 'با موفقیت در خبرنامه عضو شدید!' });
      } else {
        // Default API call
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            source: 'newsletter-section'
          }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          setEmail('');
        } else {
          setMessage({ type: 'error', text: data.message || 'خطا در عضویت خبرنامه' });
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ type: 'error', text: 'خطا در اتصال به سرور' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`py-20 bg-gray-900 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Classic Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 mb-8">
            <svg className="w-5 h-5 text-gray-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-300 text-sm font-medium">عضویت در خبرنامه</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Classic Form */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg placeholder-gray-500"
                required
              />
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`p-4 rounded-lg text-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              loading={isLoading}
            >
              {buttonText}
            </Button>
          </form>

          {/* Classic Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">بدون اسپم</h4>
              <p className="text-gray-400 text-sm">فقط محتوای مفید و مرتبط</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">تخفیف‌های ویژه</h4>
              <p className="text-gray-400 text-sm">پیشنهادات انحصاری برای اعضا</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">اولویت اطلاع‌رسانی</h4>
              <p className="text-gray-400 text-sm">اولین کسی باشید که از محصولات جدید مطلع می‌شوید</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
