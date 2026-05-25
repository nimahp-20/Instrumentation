'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';

const authFieldClass =
  'w-full min-h-[3rem] py-3 border-2 rounded-xl bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors border-[var(--border)]';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AUTH_ICON_SLOT = 'absolute inset-y-0 left-3.5 w-6 flex items-center justify-center pointer-events-none text-[var(--text-muted)]';

function fieldUsesLtrInput(type: string) {
  return type === 'email' || type === 'tel';
}

// Helper component for input with error display (moved outside to prevent recreation)
const InputWithError = ({
  type,
  placeholder,
  value,
  onChange,
  fieldName,
  icon,
  fieldErrors,
  required = false,
  autoComplete,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldName: string;
  icon?: React.ReactNode;
  fieldErrors: Record<string, string>;
  required?: boolean;
  autoComplete?: string;
}) => {
  const hasIcon = icon != null;
  const ltrField = fieldUsesLtrInput(type);

  return (
    <div className="space-y-2">
      <div className="relative">
        {hasIcon && <div className={AUTH_ICON_SLOT}>{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          dir={ltrField ? 'ltr' : undefined}
          autoComplete={
            autoComplete ??
            (type === 'email' ? 'email' : type === 'tel' ? 'tel' : type === 'password' ? 'current-password' : 'off')
          }
          className={`${authFieldClass} ${
            hasIcon
              ? ltrField
                ? 'pl-12 pr-4 text-left'
                : 'pl-12 pr-4 text-end'
              : 'px-4 text-end'
          } ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}`}
          required={required}
        />
      </div>
      {fieldErrors[fieldName] && (
        <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{fieldErrors[fieldName]}</span>
        </div>
      )}
    </div>
  );
};

// Password input component with show/hide functionality
const PasswordInputWithError = ({
  placeholder,
  value,
  onChange,
  fieldName,
  fieldErrors,
  required = false,
  autoComplete = 'current-password',
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldName: string;
  fieldErrors: Record<string, string>;
  required?: boolean;
  autoComplete?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 w-6 flex items-center justify-center pointer-events-none text-[var(--text-muted)]">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`${authFieldClass} pl-12 pr-12 text-end ${
            fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''
          }`}
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3.5 w-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10"
          aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {fieldErrors[fieldName] && (
        <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{fieldErrors[fieldName]}</span>
        </div>
      )}
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const { login, register } = useAuthContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setError('');
      setFieldErrors({});
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await login(loginData);
      if (result.success) {
        onClose();
        setLoginData({ email: '', password: '' });
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        } else {
          setError(result.message || 'خطا در ورود');
        }
      }
    } catch (_error) {
      setError('خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    if (registerData.password !== registerData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'رمز عبور و تأیید رمز عبور مطابقت ندارند' });
      return;
    }

    if (registerData.password.length < 6) {
      setFieldErrors({ password: 'رمز عبور باید حداقل ۶ کاراکتر باشد' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone || undefined
      });

      if (result.success) {
        onClose();
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: ''
        });
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        } else {
          setError(result.message || 'خطا در ثبت نام');
        }
      }
    } catch (_error) {
      setError('خطا در ثبت نام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (form: 'login' | 'register', field: string, value: string) => {
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };


  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="auth-modal-backdrop"
        onClick={onClose}
        aria-label="بستن"
        tabIndex={-1}
      />

      <div className="auth-modal-center">
        <div className="auth-modal-panel">
          {/* Elegant Header */}
          <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-8 py-6">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className=' flex-col gap-2 text-white/80'>
                  <h2 id="auth-modal-title" className="text-2xl font-bold text-white">
                    {activeTab === 'login' ? 'خوش آمدید' : 'ایجاد حساب'}
                  </h2>
                  <p className="text-sm text-slate-100/95 leading-relaxed">
                    {activeTab === 'login' ? 'به حساب کاربری خود وارد شوید' : 'حساب کاربری جدید ایجاد کنید'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sophisticated Tabs */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-4 border-b border-slate-200">
            <div className="flex bg-white rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 px-6 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${activeTab === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>ورود</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 px-6 py-3 text-center font-semibold rounded-xl transition-all duration-300 ${activeTab === 'register'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>ثبت نام</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 bg-gradient-to-br from-white to-slate-50">
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <InputWithError
                    type="email"
                    placeholder="آدرس ایمیل"
                    value={loginData.email}
                    onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                    fieldName="email"
                    fieldErrors={fieldErrors}
                    icon={
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    }
                    required
                  />

                  <PasswordInputWithError
                    placeholder="رمز عبور"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                    fieldName="password"
                    fieldErrors={fieldErrors}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>ورود به حساب</span>
                  </div>
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWithError
                    type="text"
                    placeholder="نام"
                    value={registerData.firstName}
                    onChange={(e) => handleInputChange('register', 'firstName', e.target.value)}
                    fieldName="firstName"
                    fieldErrors={fieldErrors}
                    autoComplete="given-name"
                    required
                  />
                  <InputWithError
                    type="text"
                    placeholder="نام خانوادگی"
                    value={registerData.lastName}
                    onChange={(e) => handleInputChange('register', 'lastName', e.target.value)}
                    fieldName="lastName"
                    fieldErrors={fieldErrors}
                    autoComplete="family-name"
                    required
                  />
                </div>

                <InputWithError
                  type="email"
                  placeholder="آدرس ایمیل"
                  value={registerData.email}
                  onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                  fieldName="email"
                  fieldErrors={fieldErrors}
                  autoComplete="email"
                  icon={
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                  required
                />

                <InputWithError
                  type="tel"
                  placeholder="شماره تلفن (اختیاری)"
                  value={registerData.phone}
                  onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                  fieldName="phone"
                  fieldErrors={fieldErrors}
                  autoComplete="tel"
                  icon={
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />

                <PasswordInputWithError
                  placeholder="رمز عبور"
                  value={registerData.password}
                  onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                  fieldName="password"
                  fieldErrors={fieldErrors}
                  autoComplete="new-password"
                  required
                />

                <PasswordInputWithError
                  placeholder="تأیید رمز عبور"
                  value={registerData.confirmPassword}
                  onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                  fieldName="confirmPassword"
                  fieldErrors={fieldErrors}
                  autoComplete="new-password"
                  required
                />

                <Button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>ایجاد حساب</span>
                  </div>
                </Button>
              </form>
            )}

            {/* Elegant Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-sm">
                  {activeTab === 'login' ? (
                    <>
                      حساب کاربری ندارید؟{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold hover:underline transition-colors"
                      >
                        همین حالا ثبت نام کنید
                      </button>
                    </>
                  ) : (
                    <>
                      قبلاً عضو شده‌اید؟{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold hover:underline transition-colors"
                      >
                        وارد شوید
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex items-center justify-center space-x-6 space-x-reverse text-slate-500">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs">امن و محفوظ</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs">سریع و آسان</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs">رایگان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
