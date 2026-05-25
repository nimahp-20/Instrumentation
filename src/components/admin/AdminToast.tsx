'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type AdminToastProps = {
  message: string;
  variant?: 'success' | 'error';
  durationMs?: number;
  onDismiss: () => void;
};

export function AdminToast({
  message,
  variant = 'success',
  durationMs = 4500,
  onDismiss,
}: AdminToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, onDismiss]);

  if (!mounted) return null;

  const isSuccess = variant === 'success';

  return createPortal(
    <div
      className="admin-shell fixed bottom-6 start-6 z-[250] max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
          isSuccess
            ? 'bg-blue-50 border-blue-200 text-blue-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}
      >
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isSuccess ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
          }`}
          aria-hidden
        >
          {isSuccess ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
        <p className="text-sm font-medium leading-relaxed flex-1 pt-1">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-current opacity-60 hover:opacity-100 p-1"
          aria-label="بستن"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
