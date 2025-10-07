'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AuthForm({ mode, onSuccess, onError }: AuthFormProps) {
  const { login, register } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      let response;
      
      if (mode === 'login') {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
        });
      }

      if (response.success) {
        onSuccess?.();
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          onError?.(response.message);
        }
      }
    } catch (error) {
      onError?.('خطای شبکه - لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'ورود' : 'ثبت نام'}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' 
            ? 'به حساب کاربری خود وارد شوید' 
            : 'حساب کاربری جدید ایجاد کنید'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="نام"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="نام خانوادگی"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </>
        )}

        <div>
          <Input
            type="email"
            name="email"
            placeholder="ایمیل"
            value={formData.email}
            onChange={handleChange}
            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="شماره موبایل (اختیاری)"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        )}

        <div>
          <Input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={formData.password}
            onChange={handleChange}
            className={`w-full ${errors.password ? 'border-red-500' : ''}`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {mode === 'login' ? 'ورود' : 'ثبت نام'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {mode === 'login' ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت نام کرده‌اید؟'}
          <button
            type="button"
            onClick={() => window.location.href = mode === 'login' ? '/register' : '/login'}
            className="text-blue-600 hover:text-blue-700 font-medium mr-1"
          >
            {mode === 'login' ? 'ثبت نام کنید' : 'وارد شوید'}
          </button>
        </p>
      </div>
    </div>
  );
}
