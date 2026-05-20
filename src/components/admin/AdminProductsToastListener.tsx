'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminToast } from '@/components/admin/AdminToast';

const TOAST_MESSAGES: Record<string, string> = {
  'product-created': 'محصول با موفقیت ثبت شد.',
  'product-updated': 'تغییرات محصول ذخیره شد.',
};

export function AdminProductsToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const key = searchParams.get('toast');
    if (!key) return;
    const text = TOAST_MESSAGES[key];
    if (text) setMessage(text);
    router.replace('/admin/products', { scroll: false });
  }, [searchParams, router]);

  if (!message) return null;

  return <AdminToast message={message} onDismiss={() => setMessage(null)} />;
}
