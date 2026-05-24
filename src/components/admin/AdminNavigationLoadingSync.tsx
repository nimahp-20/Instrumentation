'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

export function AdminNavigationLoadingSync() {
  const pathname = usePathname();
  const { resetLoading } = useAdminLoading();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetLoading();
  }, [pathname, resetLoading]);

  return null;
}
