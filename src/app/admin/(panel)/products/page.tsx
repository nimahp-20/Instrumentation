'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AdminLink } from '@/components/admin/AdminLink';
import { AdminConfirmModal } from '@/components/admin/AdminConfirmModal';
import { AdminLoadingBlock } from '@/components/admin/AdminLoading';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';
import { AdminProductsToastListener } from '@/components/admin/AdminProductsToastListener';

type ProductFilter = 'all' | 'active' | 'out_of_stock';

interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isOnSale?: boolean;
  stock: number;
  isActive: boolean;
  images?: string[];
  category?: { name?: string };
}

const TABS: { label: string; filter: ProductFilter }[] = [
  { label: 'همه', filter: 'all' },
  { label: 'فعال', filter: 'active' },
  { label: 'ناموجود', filter: 'out_of_stock' },
];

const PAGE_SIZE = 30;
const DEFAULT_RESTOCK = 10;

type PendingAction =
  | { type: 'out_of_stock'; product: ProductRow }
  | { type: 'restock'; product: ProductRow }
  | { type: 'delete'; product: ProductRow };

const filterGradientStyle = {
  background: 'linear-gradient(90deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
} as const;

function IconEdit() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconStockOut() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

function IconStockIn() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ProductThumb({ product }: { product: ProductRow }) {
  if (product.images?.[0]) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- آپلود محلی /uploads
      <img
        src={product.images[0]}
        alt=""
        width={44}
        height={44}
        className="rounded-xl object-cover w-11 h-11 ring-1 ring-slate-100 shadow-sm shrink-0"
      />
    );
  }

  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
    >
      {(product.name?.[0] || '?').toUpperCase()}
    </div>
  );
}

function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`} />
      {isActive ? 'فعال' : 'غیرفعال'}
    </span>
  );
}

function ProductPriceCell({ product }: { product: ProductRow }) {
  if (product.originalPrice != null && product.originalPrice > product.price) {
    return (
      <div className="space-y-0.5">
        <p className="font-semibold text-slate-800">
          {product.price?.toLocaleString('fa-IR')}{' '}
          <span className="text-xs font-normal text-slate-500">تومان</span>
        </p>
        <p className="text-xs text-slate-400 line-through">{product.originalPrice.toLocaleString('fa-IR')}</p>
        <span className="inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
          −
          {(product.discount ??
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
            .toLocaleString('fa-IR')}
          ٪
        </span>
      </div>
    );
  }

  return (
    <p className="font-semibold text-slate-800">
      {product.price?.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">تومان</span>
    </p>
  );
}

function ProductActions({
  product,
  busy,
  onPending,
  layout = 'inline',
}: {
  product: ProductRow;
  busy: boolean;
  onPending: (action: PendingAction) => void;
  layout?: 'inline' | 'bar';
}) {
  const btnBase =
    layout === 'bar'
      ? 'flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-40'
      : 'inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-40';

  return (
    <div className={layout === 'bar' ? 'flex items-stretch gap-2' : 'flex flex-wrap items-center gap-1'}>
      <AdminLink
        href={`/admin/products/${product._id}/edit`}
        loadingMessage="در حال باز کردن ویرایش..."
        className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300`}
        title="ویرایش"
      >
        <IconEdit />
        <span>ویرایش</span>
      </AdminLink>
      {product.stock > 0 ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onPending({ type: 'out_of_stock', product })}
          className={`${btnBase} border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100`}
          title="ناموجود کردن"
        >
          <IconStockOut />
          <span>{layout === 'bar' ? 'ناموجود' : 'ناموجود'}</span>
        </button>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => onPending({ type: 'restock', product })}
          className={`${btnBase} border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100`}
          title="موجود کردن"
        >
          <IconStockIn />
          <span>{layout === 'bar' ? 'موجود' : 'موجود'}</span>
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => onPending({ type: 'delete', product })}
        className={`${btnBase} border border-red-200 bg-red-50 text-red-800 hover:bg-red-100`}
        title="حذف"
      >
        <IconTrash />
        <span>حذف</span>
      </button>
    </div>
  );
}

function ProductMobileCard({
  product,
  busy,
  onPending,
}: {
  product: ProductRow;
  busy: boolean;
  onPending: (action: PendingAction) => void;
}) {
  return (
    <article className="p-4 space-y-3">
      <ProductActions product={product} busy={busy} onPending={onPending} layout="bar" />

      <div className="flex items-start gap-3">
        <ProductThumb product={product} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 leading-snug">{product.name}</p>
          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{product.slug}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <ProductStatusBadge isActive={product.isActive} />
            {product.category?.name ? (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{product.category.name}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
        <div>
          <p className="text-[11px] text-[var(--admin-muted)] mb-0.5">قیمت</p>
          <ProductPriceCell product={product} />
        </div>
        <div>
          <p className="text-[11px] text-[var(--admin-muted)] mb-0.5">موجودی</p>
          <span
            className={`text-sm font-semibold tabular-nums ${product.stock <= 5 ? 'text-red-600' : 'text-slate-700'}`}
          >
            {product.stock?.toLocaleString('fa-IR')}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function AdminProductsPage() {
  const { runAsync, startLoading, stopLoading, isLoading: globalLoading } = useAdminLoading();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ProductFilter>('all');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [restockQty, setRestockQty] = useState(String(DEFAULT_RESTOCK));
  const [actionError, setActionError] = useState('');
  const [stats, setStats] = useState<{ products: number; lowStock: number } | null>(null);
  const pendingOverlayRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      page: String(page),
      filter,
    });
    const res = await fetch(`/api/admin/products?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      const list = (data.products || []).map((p: ProductRow & { _id: unknown }) => ({
        ...p,
        _id: String(p._id),
      }));
      setProducts(list);
      setTotal(data.pagination?.totalCount ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } else {
      setError(data.message || 'خطا در بارگذاری');
      setProducts([]);
    }
  }, [filter, page]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    if (!pendingOverlayRef.current) {
      startLoading('در حال بارگذاری محصولات...');
    }
    try {
      await fetchProducts();
    } catch {
      setError('خطا در اتصال به سرور');
      setProducts([]);
    } finally {
      pendingOverlayRef.current = false;
      setLoading(false);
      stopLoading();
    }
  }, [fetchProducts, startLoading, stopLoading]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    void runAsync(async () => {
      const res = await fetch('/api/admin/stats', { credentials: 'include' });
      const data = await res.json();
      if (!cancelled && data.success && data.data) {
        setStats({
          products: data.data.products ?? 0,
          lowStock: data.data.lowStock ?? 0,
        });
      }
    }, 'در حال دریافت آمار...').catch(() => {
      if (!cancelled) setStats(null);
    });
    return () => {
      cancelled = true;
    };
  }, [runAsync]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const openPending = (action: PendingAction) => {
    setActionError('');
    if (action.type === 'restock') {
      setRestockQty(String(DEFAULT_RESTOCK));
    }
    setPending(action);
  };

  const closePending = () => {
    if (actionId) return;
    setPending(null);
    setActionError('');
  };

  const runPendingAction = async () => {
    if (!pending) return;

    const id = pending.product._id;
    setActionError('');

    if (pending.type === 'restock') {
      const stock = parseInt(restockQty, 10);
      if (Number.isNaN(stock) || stock < 1) {
        setActionError('تعداد موجودی باید عددی بزرگ‌تر از صفر باشد.');
        return;
      }
    }

    const actionMessage =
      pending.type === 'delete'
        ? 'در حال حذف محصول...'
        : pending.type === 'out_of_stock'
          ? 'در حال ناموجود کردن...'
          : 'در حال به‌روزرسانی موجودی...';

    setActionId(id);
    try {
      await runAsync(async () => {
        if (pending.type === 'delete') {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          const data = await res.json();
          if (!data.success) {
            setActionError(data.message || 'حذف نشد');
            return;
          }
        } else if (pending.type === 'out_of_stock') {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: 0 }),
          });
          const data = await res.json();
          if (!data.success) {
            setActionError(data.message || 'انجام نشد');
            return;
          }
        } else {
          const stock = parseInt(restockQty, 10);
          const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock }),
          });
          const data = await res.json();
          if (!data.success) {
            setActionError(data.message || 'انجام نشد');
            return;
          }
        }

        setPending(null);
        setLoading(true);
        try {
          await fetchProducts();
        } finally {
          setLoading(false);
        }
      }, actionMessage);
    } catch {
      setActionError('خطا در اتصال به سرور');
    } finally {
      setActionId(null);
    }
  };

  const modalConfig = (() => {
    if (!pending) return null;
    const name = pending.product.name;
    switch (pending.type) {
      case 'out_of_stock':
        return {
          title: 'ناموجود کردن',
          message: `موجودی «${name}» صفر شود؟ در فروشگاه به‌عنوان ناموجود نمایش داده می‌شود.`,
          confirmLabel: 'بله، ناموجود کن',
          variant: 'warning' as const,
        };
      case 'restock':
        return {
          title: 'موجود کردن',
          message: `موجودی «${name}» را بازیابی کنید:`,
          confirmLabel: 'ذخیره موجودی',
          variant: 'primary' as const,
        };
      case 'delete':
        return {
          title: 'حذف محصول',
          message: `محصول «${name}» برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.`,
          confirmLabel: 'بله، حذف شود',
          variant: 'danger' as const,
        };
    }
  })();

  const filterLabel =
    filter === 'all' ? 'همه محصولات' : filter === 'active' ? 'محصولات فعال' : 'ناموجود';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* هدر هم‌سبک پروفایل: نوار navy + بدنه سفید */}
      <div className="admin-card overflow-hidden relative">
        <div
          className="h-32 sm:h-40 relative"
          style={{
            background:
              'linear-gradient(120deg, var(--admin-navy) 0%, var(--admin-navy-2) 45%, var(--admin-primary) 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgb(15_23_42/0.15)_100%)]" />
          <div className="absolute bottom-4 end-6 text-white/90 text-sm font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            مدیریت کاتالوگ
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-7 sm:pb-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            <div className="relative -mt-16 sm:-mt-[4.25rem] shrink-0">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white"
                style={{
                  background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)',
                }}
                aria-hidden
              >
                <svg className="w-11 h-11 sm:w-12 sm:h-12 opacity-95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-right min-w-0 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text)] mb-1.5 tracking-tight">محصولات</h1>
              <p className="text-[var(--admin-muted)] text-base sm:text-lg mb-4 sm:mb-5">
                {total.toLocaleString('fa-IR')} قلم با فیلتر «{filterLabel}» · صفحه{' '}
                {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-sky-50 text-sky-900 border border-sky-200/80">
                  <svg className="w-4 h-4 shrink-0 text-[var(--admin-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  {filterLabel}
                </span>
                {stats != null && stats.lowStock > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium bg-amber-50 text-amber-900 border border-amber-200/80">
                    <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {stats.lowStock.toLocaleString('fa-IR')} قلم با موجودی ≤ ۵
                  </span>
                )}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <AdminLink
                  href="/admin/products/new"
                  loadingMessage="در حال باز کردن فرم محصول..."
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-[0.97] transition-opacity"
                  style={filterGradientStyle}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  محصول جدید
                </AdminLink>
                <AdminLink
                  href="/products"
                  loadingMessage="در حال باز کردن فروشگاه..."
                  className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-slate-50 text-[var(--admin-text)] border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  مشاهده در فروشگاه
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </AdminLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* آمار — سبک کارت‌های پروفایل */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="admin-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-primary)]"
              style={{ background: 'rgb(224 242 254 / 0.9)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[var(--admin-muted)] mb-0.5">کل در دیتابیس</p>
              <p className="text-base sm:text-lg font-bold text-[var(--admin-text)] tabular-nums">
                {stats != null ? stats.products.toLocaleString('fa-IR') : '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="admin-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-blue-600"
              style={{ background: 'rgb(220 252 231 / 0.9)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[var(--admin-muted)] mb-0.5">هشدار موجودی (≤۵)</p>
              <p className="text-base sm:text-lg font-bold text-[var(--admin-text)] tabular-nums">
                {stats != null ? stats.lowStock.toLocaleString('fa-IR') : '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="admin-card p-5 sm:p-6 transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[var(--admin-purple)]"
              style={{ background: 'rgb(243 232 255 / 0.9)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[var(--admin-muted)] mb-0.5">نتیجهٔ فیلتر فعلی</p>
              <p className="text-base sm:text-lg font-bold text-[var(--admin-text)] tabular-nums">{total.toLocaleString('fa-IR')}</p>
              <p className="text-xs text-[var(--admin-muted)] mt-1">{filterLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="admin-card p-4 text-red-600 text-sm border-red-100">{error}</div>
      ) : null}

      {/* تب‌ها — هم‌سبک TabNavigation پروفایل */}
      <div className="admin-card p-1.5 sm:p-2">
        <div className="flex rounded-[10px] bg-slate-100/80 p-1 gap-1 overflow-x-auto scrollbar-thin">
          {TABS.map((t) => {
            const active = filter === t.filter;
            return (
              <button
                key={t.filter}
                type="button"
                onClick={() => {
                  if (filter !== t.filter) {
                    pendingOverlayRef.current = true;
                    startLoading('در حال بارگذاری محصولات...');
                  }
                  setFilter(t.filter);
                }}
                className={`flex-shrink-0 flex items-center justify-center gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-[10px] text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'text-white shadow-md'
                    : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-white/90'
                }`}
                style={active ? filterGradientStyle : undefined}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="font-semibold text-slate-800">فهرست محصولات</h2>
          <p className="text-xs text-[var(--admin-muted)] mt-0.5">
            عملیات در ابتدای هر ردیف · در موبایل به‌صورت کارت
          </p>
        </div>

        {loading ? (
          <AdminLoadingBlock message="در حال بارگذاری محصولات..." />
        ) : products.length === 0 ? (
          <div className="p-12 sm:p-16 text-center">
            <div
              className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
              style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
            >
              <svg className="w-7 h-7 opacity-95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-slate-800 font-semibold">محصولی یافت نشد</p>
            <p className="text-sm text-[var(--admin-muted)] mt-2 max-w-sm mx-auto">
              با فیلتر انتخاب‌شده موردی نیست. فیلتر را عوض کنید یا اولین محصول را اضافه کنید.
            </p>
            <AdminLink
              href="/admin/products/new"
              loadingMessage="در حال باز کردن فرم محصول..."
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              style={filterGradientStyle}
            >
              افزودن محصول
            </AdminLink>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-slate-100">
              {products.map((p) => (
                <ProductMobileCard
                  key={p._id}
                  product={p}
                  busy={actionId === p._id}
                  onPending={openPending}
                />
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="admin-products-table w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-100">
                    <th className="text-start p-4 font-semibold min-w-[12rem]">محصول</th>
                    <th className="text-start p-4 font-semibold whitespace-nowrap">موجودی</th>
                    <th className="text-start p-4 font-semibold whitespace-nowrap">قیمت</th>
                    <th className="text-start p-4 font-semibold whitespace-nowrap">وضعیت</th>
                    <th className="text-start p-4 font-semibold hidden xl:table-cell">دسته</th>
                    <th className="admin-products-actions-col text-start p-4 font-semibold whitespace-nowrap min-w-[9.5rem]">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const busy = actionId === p._id;
                    return (
                      <tr key={p._id} className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ProductThumb product={p} />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 truncate">{p.name}</p>
                              <p className="text-xs text-slate-400 font-mono truncate">{p.slug}</p>
                              <p className="text-xs text-slate-500 mt-0.5 xl:hidden truncate">
                                {p.category?.name || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={
                              p.stock <= 5 ? 'text-red-600 font-semibold tabular-nums' : 'text-slate-700 tabular-nums'
                            }
                          >
                            {p.stock?.toLocaleString('fa-IR')}
                          </span>
                        </td>
                        <td className="p-4 tabular-nums">
                          <ProductPriceCell product={p} />
                        </td>
                        <td className="p-4">
                          <ProductStatusBadge isActive={p.isActive} />
                        </td>
                        <td className="p-4 text-slate-600 hidden xl:table-cell">{p.category?.name || '—'}</td>
                        <td className="admin-products-actions-col p-3">
                          <ProductActions product={p} busy={busy} onPending={openPending} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
            <p className="text-xs text-[var(--admin-muted)]">
              صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')} ·{' '}
              {total.toLocaleString('fa-IR')} قلم
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || globalLoading}
                onClick={() => {
                  pendingOverlayRef.current = true;
                  startLoading('در حال بارگذاری محصولات...');
                  setPage((p) => Math.max(1, p - 1));
                }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                قبلی
              </button>
              <button
                type="button"
                disabled={page >= totalPages || globalLoading}
                onClick={() => {
                  pendingOverlayRef.current = true;
                  startLoading('در حال بارگذاری محصولات...');
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <AdminProductsToastListener />
      </Suspense>

      {modalConfig && pending ? (
        <AdminConfirmModal
          open
          title={modalConfig.title}
          message={modalConfig.message}
          confirmLabel={modalConfig.confirmLabel}
          variant={modalConfig.variant}
          loading={actionId === pending.product._id}
          error={actionError}
          onClose={closePending}
          onConfirm={runPendingAction}
        >
          {pending.type === 'restock' ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">تعداد موجودی</span>
              <input
                type="number"
                min={1}
                step={1}
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tabular-nums"
                disabled={actionId === pending.product._id}
              />
            </label>
          ) : null}
        </AdminConfirmModal>
      ) : null}
    </div>
  );
}
