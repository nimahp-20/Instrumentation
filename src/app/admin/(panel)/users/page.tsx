'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminLoadingBlock } from '@/components/admin/AdminLoading';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

interface AdminUserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt?: string;
  lastLogin?: string | null;
}

export default function AdminUsersPage() {
  const { runAsync, isLoading: globalLoading } = useAdminLoading();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '30' });
    if (debouncedQ) params.set('q', debouncedQ);
    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.users || []);
      setTotalCount(data.pagination?.totalCount ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } else {
      setError(data.message || 'خطا در بارگذاری کاربران');
      setUsers([]);
    }
  }, [page, debouncedQ]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await runAsync(fetchUsers, 'در حال بارگذاری کاربران...');
    } catch {
      setError('خطا در اتصال به سرور');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, runAsync]);

  useEffect(() => {
    load();
  }, [load]);

  const roleLabel = (role: string) => {
    if (role === 'admin') return 'مدیر';
    if (role === 'moderator') return 'ناظر';
    return 'کاربر';
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">کاربران</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">
            {totalCount.toLocaleString('fa-IR')} کاربر ثبت‌شده
          </p>
        </div>
      </header>

      <div className="admin-card p-4 flex flex-wrap gap-3 items-center">
        <label className="sr-only">جستجوی کاربر</label>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو بر اساس ایمیل یا نام..."
          className="admin-input-search flex-1 min-w-[200px] max-w-md py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--admin-header)]/50 rounded-[10px] border border-slate-200"
        />
      </div>

      {error && <div className="admin-card p-4 text-red-600 text-sm border-red-100">{error}</div>}

      <div className="admin-card overflow-hidden">
        {loading ? (
          <AdminLoadingBlock message="در حال بارگذاری کاربران..." />
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-[var(--admin-muted)]">کاربری یافت نشد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-100">
                  <th className="text-start p-4 font-semibold">کاربر</th>
                  <th className="text-start p-4 font-semibold">ایمیل</th>
                  <th className="text-start p-4 font-semibold">نقش</th>
                  <th className="text-start p-4 font-semibold">وضعیت</th>
                  <th className="text-start p-4 font-semibold">تأیید ایمیل</th>
                  <th className="text-start p-4 font-semibold">عضویت</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{
                            background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
                          }}
                        >
                          {(u.firstName?.[0] || u.email?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {u.firstName} {u.lastName}
                          </p>
                          {u.phone && <p className="text-xs text-slate-400 tabular-nums">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs break-all max-w-[220px]">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-violet-100 text-violet-800'
                            : u.role === 'moderator'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {u.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{u.emailVerified ? 'بله' : 'خیر'}</td>
                    <td className="p-4 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
            <p className="text-xs text-[var(--admin-muted)]">
              صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || globalLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                قبلی
              </button>
              <button
                type="button"
                disabled={page >= totalPages || globalLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
