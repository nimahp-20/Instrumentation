'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type AdminConfirmVariant = 'primary' | 'warning' | 'danger';

type AdminConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AdminConfirmVariant;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
};

const confirmBtnClass: Record<AdminConfirmVariant, string> = {
  primary: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
};

export function AdminConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  variant = 'primary',
  loading = false,
  error,
  onConfirm,
  onClose,
  children,
}: AdminConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, loading, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="auth-modal-overlay admin-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
    >
      <button
        type="button"
        className="auth-modal-backdrop"
        onClick={loading ? undefined : onClose}
        aria-label="بستن"
        tabIndex={-1}
        disabled={loading}
      />

      <div className="auth-modal-center">
        <div className="auth-modal-panel max-w-md overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/90">
            <h2 id="admin-confirm-title" className="text-lg font-bold text-slate-800">
              {title}
            </h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
            {children}
            {error ? (
              <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            ) : null}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap-reverse gap-2 justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60 transition-colors ${confirmBtnClass[variant]}`}
            >
              {loading ? 'در حال انجام...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
