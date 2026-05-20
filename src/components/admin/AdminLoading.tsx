'use client';

export function AdminSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-[3px]' : 'w-8 h-8 border-[3px]';
  return (
    <div
      className={`${dim} rounded-full animate-spin border-slate-200 border-t-sky-600`}
      role="status"
      aria-label="در حال بارگذاری"
    />
  );
}

export function AdminLoadingBlock({ message = 'در حال بارگذاری...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 sm:p-16">
      <AdminSpinner size="lg" />
      <p className="text-sm font-medium text-[var(--admin-muted)]">{message}</p>
    </div>
  );
}

export function AdminLoadingOverlay({
  active,
  message = 'لطفاً صبر کنید...',
}: {
  active: boolean;
  message?: string;
}) {
  if (!active) return null;

  return (
    <div
      className="admin-loading-overlay admin-shell"
      role="alert"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="admin-loading-card">
        <AdminSpinner size="lg" />
        <p className="text-sm font-semibold text-slate-800">{message}</p>
      </div>
    </div>
  );
}
