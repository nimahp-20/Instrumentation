'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui';

export function AdminLoginForm() {
  const { adminLogin } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    urlError === 'unauthorized' ? 'فقط مدیران به پنل دسترسی دارند' : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminLogin({ email, password });

      if (!response.success) {
        setError(response.message || 'ورود ناموفق بود');
        return;
      }

      router.replace(redirect);
    } catch {
      setError('خطای شبکه — لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-shell w-full max-w-[440px]">
      <div className="admin-card overflow-hidden shadow-xl">
        <div
          className="h-2 w-full"
          style={{ background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
        />
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
            >
              ا
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ورود به پنل مدیریت</h1>
            <p className="text-[var(--admin-muted)] text-sm mt-2">ابزارکده — فقط حساب مدیر</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-[10px] text-sm border bg-red-50 border-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="ایمیل"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
            />
            <Input
              label="رمز عبور"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Button type="submit" fullWidth loading={isLoading} size="lg">
              ورود
            </Button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-8 leading-relaxed">
            توکن دسترسی در کوکی امن (httpOnly) ذخیره می‌شود و در حافظه مرورگر قابل خواندن نیست.
          </p>
        </div>
      </div>
    </div>
  );
}
