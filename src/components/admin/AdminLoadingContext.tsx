'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AdminLoadingOverlay } from '@/components/admin/AdminLoading';

const DEFAULT_MESSAGE = 'لطفاً صبر کنید...';

type AdminLoadingContextValue = {
  isLoading: boolean;
  message: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  runAsync: <T>(fn: () => Promise<T>, message?: string) => Promise<T>;
};

const AdminLoadingContext = createContext<AdminLoadingContextValue | null>(null);

export function AdminLoadingProvider({ children }: { children: ReactNode }) {
  const countRef = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const syncVisible = useCallback(() => {
    setIsLoading(countRef.current > 0);
  }, []);

  const startLoading = useCallback(
    (msg?: string) => {
      countRef.current += 1;
      if (msg) setMessage(msg);
      else if (countRef.current === 1) setMessage(DEFAULT_MESSAGE);
      syncVisible();
    },
    [syncVisible]
  );

  const stopLoading = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) setMessage(DEFAULT_MESSAGE);
    syncVisible();
  }, [syncVisible]);

  const runAsync = useCallback(
    async <T,>(fn: () => Promise<T>, msg?: string): Promise<T> => {
      startLoading(msg);
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const value = useMemo(
    () => ({ isLoading, message, startLoading, stopLoading, runAsync }),
    [isLoading, message, startLoading, stopLoading, runAsync]
  );

  return (
    <AdminLoadingContext.Provider value={value}>
      {children}
      <AdminLoadingOverlay active={isLoading} message={message} />
    </AdminLoadingContext.Provider>
  );
}

export function useAdminLoading(): AdminLoadingContextValue {
  const ctx = useContext(AdminLoadingContext);
  if (!ctx) {
    throw new Error('useAdminLoading must be used within AdminLoadingProvider');
  }
  return ctx;
}
