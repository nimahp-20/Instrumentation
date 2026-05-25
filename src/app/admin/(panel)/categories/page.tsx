'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { AdminLoadingBlock } from '@/components/admin/AdminLoading';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

interface CategoryRow {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  productCount?: number;
  seoTitle?: string;
  seoDescription?: string;
}

type FormState = {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  image: string;
  icon: string;
  sortOrder: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

function emptyForm(): FormState {
  return {
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    image: '',
    icon: '',
    sortOrder: '0',
    isActive: true,
    seoTitle: '',
    seoDescription: '',
  };
}

function rowToForm(c: CategoryRow): FormState {
  return {
    name: c.name || '',
    nameEn: c.nameEn || '',
    slug: c.slug || '',
    description: c.description || '',
    descriptionEn: c.descriptionEn || '',
    image: c.image || '',
    icon: c.icon || '',
    sortOrder: String(c.sortOrder ?? 0),
    isActive: c.isActive !== false,
    seoTitle: c.seoTitle || '',
    seoDescription: c.seoDescription || '',
  };
}

function slugFromEnglish(nameEn: string) {
  return nameEn
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPT_IMAGES = 'image/jpeg,image/png,image/gif,image/webp';

function isAbsoluteOrUploadUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/');
}

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

function CategoryThumb({ category }: { category: CategoryRow }) {
  const imageSrc =
    category.image && isAbsoluteOrUploadUrl(category.image) ? category.image : null;

  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- آپلود محلی /uploads
      <img
        src={imageSrc}
        alt=""
        width={44}
        height={44}
        className="rounded-xl object-cover w-11 h-11 ring-1 ring-slate-100 shadow-sm shrink-0"
      />
    );
  }

  if (category.icon) {
    return (
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg ring-1 ring-slate-100 bg-slate-50 shrink-0"
        aria-hidden
      >
        {category.icon}
      </div>
    );
  }

  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: 'linear-gradient(145deg, var(--admin-header) 0%, var(--admin-primary) 100%)' }}
    >
      {(category.name?.[0] || '?').toUpperCase()}
    </div>
  );
}

function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
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

function CategoryActions({
  category,
  busy,
  onEdit,
  onDelete,
  layout = 'inline',
}: {
  category: CategoryRow;
  busy: boolean;
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
  layout?: 'inline' | 'bar';
}) {
  const btnBase =
    layout === 'bar'
      ? 'flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-40'
      : 'inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-40';

  return (
    <div className={layout === 'bar' ? 'flex items-stretch gap-2' : 'flex flex-wrap items-center gap-1'}>
      <button
        type="button"
        disabled={busy}
        onClick={() => onEdit(category)}
        className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300`}
        title="ویرایش"
      >
        <IconEdit />
        <span>ویرایش</span>
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onDelete(category)}
        className={`${btnBase} border border-red-200 bg-red-50 text-red-800 hover:bg-red-100`}
        title="حذف"
      >
        <IconTrash />
        <span>حذف</span>
      </button>
    </div>
  );
}

function CategoryMobileCard({
  category,
  busy,
  onEdit,
  onDelete,
}: {
  category: CategoryRow;
  busy: boolean;
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
}) {
  const isActive = category.isActive !== false;

  return (
    <article className="p-4 space-y-3">
      <CategoryActions
        category={category}
        busy={busy}
        onEdit={onEdit}
        onDelete={onDelete}
        layout="bar"
      />

      <div className="flex items-start gap-3">
        <CategoryThumb category={category} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 leading-snug">{category.name}</p>
          {category.nameEn ? (
            <p className="text-xs text-slate-500 truncate mt-0.5">{category.nameEn}</p>
          ) : null}
          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{category.slug}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <CategoryStatusBadge isActive={isActive} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
        <div>
          <p className="text-[11px] text-[var(--admin-muted)] mb-0.5">محصولات</p>
          <span className="text-sm font-semibold tabular-nums text-slate-700">
            {(category.productCount ?? 0).toLocaleString('fa-IR')}
          </span>
        </div>
        <div>
          <p className="text-[11px] text-[var(--admin-muted)] mb-0.5">ترتیب</p>
          <span className="text-sm font-semibold tabular-nums text-slate-700">
            {(category.sortOrder ?? 0).toLocaleString('fa-IR')}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function AdminCategoriesPage() {
  const { runAsync } = useAdminLoading();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editOriginalSlug, setEditOriginalSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionSlug, setActionSlug] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const revokeLocalPreview = useCallback(() => {
    setLocalImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/categories?all=1', { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setCategories(data.data || []);
    } else {
      setBanner({ type: 'err', text: data.error || 'بارگذاری ناموفق بود' });
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await runAsync(fetchCategories, 'در حال بارگذاری دسته‌ها...');
    } catch {
      setBanner({ type: 'err', text: 'خطای شبکه هنگام بارگذاری دسته‌ها' });
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, runAsync]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return () => revokeLocalPreview();
  }, [revokeLocalPreview]);

  const openCreate = () => {
    setEditOriginalSlug(null);
    setForm(emptyForm());
    setImageFile(null);
    revokeLocalPreview();
    setPanelOpen(true);
    setBanner(null);
  };

  const openEdit = (c: CategoryRow) => {
    setEditOriginalSlug(c.slug);
    setForm(rowToForm(c));
    setImageFile(null);
    revokeLocalPreview();
    setPanelOpen(true);
    setBanner(null);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditOriginalSlug(null);
    setImageFile(null);
    revokeLocalPreview();
  };

  const onImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    revokeLocalPreview();
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setBanner({
        type: 'err',
        text: `حجم فایل بیش از ${(MAX_IMAGE_BYTES / (1024 * 1024)).toLocaleString('fa-IR')} مگابایت است`,
      });
      e.target.value = '';
      setImageFile(null);
      return;
    }
    setLocalImagePreview(URL.createObjectURL(f));
    setImageFile(f);
    setBanner(null);
  };

  const buildPayload = (imageUrl: string): Record<string, unknown> => {
    const sortNum = Number.parseInt(form.sortOrder, 10);
    return {
      name: form.name.trim(),
      nameEn: form.nameEn.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim(),
      descriptionEn: form.descriptionEn.trim(),
      image: imageUrl,
      icon: form.icon.trim() || undefined,
      sortOrder: Number.isFinite(sortNum) ? sortNum : 0,
      isActive: form.isActive,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    };
  };

  const uploadCategoryImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload/category-image', {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'آپلود تصویر ناموفق بود');
    }
    return data.data.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!editOriginalSlug && !imageFile) {
      setBanner({
        type: 'err',
        text: 'برای دستهٔ جدید بارگذاری تصویر (JPEG، PNG، GIF یا WebP تا ۲ مگابایت) الزامی است',
      });
      return;
    }

    setSaving(true);
    const saveMessage = editOriginalSlug ? 'در حال ذخیرهٔ دسته...' : 'در حال ثبت دستهٔ جدید...';

    try {
      await runAsync(async () => {
        let finalImage = form.image.trim();

        if (!editOriginalSlug) {
          finalImage = await uploadCategoryImage(imageFile!);
        } else if (imageFile) {
          finalImage = await uploadCategoryImage(imageFile);
        }

        if (!finalImage) {
          setBanner({ type: 'err', text: 'تصویر دسته مشخص نیست' });
          return;
        }

        const payload = buildPayload(finalImage);

        if (editOriginalSlug) {
          const { slug: _s, ...updateBody } = payload;
          const res = await fetch(`/api/categories/${encodeURIComponent(editOriginalSlug)}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBody),
          });
          const data = await res.json();
          if (!data.success) {
            setBanner({ type: 'err', text: data.error || 'ذخیرهٔ ویرایش ناموفق بود' });
            return;
          }
          setBanner({ type: 'ok', text: 'دسته به‌روزرسانی شد' });
          await fetchCategories();
          closePanel();
        } else {
          const res = await fetch('/api/categories', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!data.success) {
            setBanner({ type: 'err', text: data.error || 'ایجاد دسته ناموفق بود' });
            return;
          }
          setBanner({ type: 'ok', text: 'دسته جدید ثبت شد' });
          await fetchCategories();
          closePanel();
        }
      }, saveMessage);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطای شبکه';
      setBanner({ type: 'err', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: CategoryRow) => {
    const ok = window.confirm(`حذف دسته «${c.name}»؟ این عمل برگشت‌پذیر نیست.`);
    if (!ok) return;
    setBanner(null);
    setActionSlug(c.slug);
    try {
      await runAsync(async () => {
        const res = await fetch(`/api/categories/${encodeURIComponent(c.slug)}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) {
          setBanner({ type: 'err', text: data.error || 'حذف ناموفق بود' });
          return;
        }
        setBanner({ type: 'ok', text: 'دسته حذف شد' });
        await fetchCategories();
      }, 'در حال حذف دسته...');
    } catch {
      setBanner({ type: 'err', text: 'خطای شبکه هنگام حذف' });
    } finally {
      setActionSlug(null);
    }
  };

  const previewSrc = localImagePreview || (form.image.trim() && isAbsoluteOrUploadUrl(form.image.trim()) ? form.image.trim() : '');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">دسته‌بندی‌ها</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">
            {categories.length.toLocaleString('fa-IR')} دسته (شامل غیرفعال)
          </p>
        </div>
        <Button type="button" onClick={openCreate} size="md">
          دستهٔ جدید
        </Button>
      </header>

      {banner && (
        <div
          className={`rounded-[10px] border px-4 py-3 text-sm ${
            banner.type === 'ok'
              ? 'bg-blue-50 border-blue-100 text-blue-800'
              : 'bg-red-50 border-red-100 text-red-700'
          }`}
        >
          {banner.text}
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="font-semibold text-slate-800">فهرست دسته‌بندی‌ها</h2>
          <p className="text-xs text-[var(--admin-muted)] mt-0.5">
            عملیات در ابتدای هر ردیف · در موبایل به‌صورت کارت
          </p>
        </div>

        {loading ? (
          <AdminLoadingBlock message="در حال بارگذاری دسته‌ها..." />
        ) : categories.length === 0 ? (
          <p className="p-10 text-center text-[var(--admin-muted)]">دسته‌بندی یافت نشد</p>
        ) : (
          <>
            <div className="md:hidden divide-y divide-slate-100">
              {categories.map((c) => (
                <CategoryMobileCard
                  key={c._id}
                  category={c}
                  busy={actionSlug === c.slug}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="admin-products-table w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-100">
                    <th className="admin-products-actions-col text-start p-4 font-semibold whitespace-nowrap min-w-[8rem]">
                      عملیات
                    </th>
                    <th className="text-start p-4 font-semibold min-w-[12rem]">دسته</th>
                    <th className="text-start p-4 font-semibold whitespace-nowrap">محصولات</th>
                    <th className="text-start p-4 font-semibold whitespace-nowrap">وضعیت</th>
                    <th className="text-start p-4 font-semibold hidden xl:table-cell">اسلاگ</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const busy = actionSlug === c.slug;
                    const isActive = c.isActive !== false;
                    return (
                      <tr key={c._id} className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="admin-products-actions-col p-3">
                          <CategoryActions
                            category={c}
                            busy={busy}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <CategoryThumb category={c} />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 truncate">{c.name}</p>
                              {c.nameEn ? (
                                <p className="text-xs text-slate-500 truncate">{c.nameEn}</p>
                              ) : null}
                              <p className="text-xs text-slate-400 font-mono truncate xl:hidden">{c.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 tabular-nums">
                          {(c.productCount ?? 0).toLocaleString('fa-IR')}
                        </td>
                        <td className="p-4">
                          <CategoryStatusBadge isActive={isActive} />
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs hidden xl:table-cell">{c.slug}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

            {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-4 sm:p-6"
          role="presentation"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) closePanel();
          }}
        >
          <div
            className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200"
            role="dialog"
            aria-labelledby="category-form-title"
          >
            <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
              <h2 id="category-form-title" className="text-lg font-bold text-slate-800">
                {editOriginalSlug ? 'ویرایش دسته' : 'دستهٔ جدید'}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                aria-label="بستن"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Input
                label="نام فارسی"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="نام انگلیسی"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                required
              />
              <div className="flex flex-col gap-2">
                <Input
                  label="اسلاگ (انگلیسی، یکتا)"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  required
                  disabled={!!editOriginalSlug}
                  className={editOriginalSlug ? 'bg-slate-50 text-slate-500' : ''}
                  helperText={editOriginalSlug ? 'اسلاگ پس از ایجاد قابل تغییر نیست (لینک‌ها و محصولات به آن وابسته‌اند).' : undefined}
                />
                {!editOriginalSlug && (
                  <button
                    type="button"
                    className="text-xs text-[var(--admin-primary)] font-medium self-start hover:underline"
                    onClick={() => setForm((f) => ({ ...f, slug: slugFromEnglish(f.nameEn) }))}
                  >
                    ساخت اسلاگ از نام انگلیسی
                  </button>
                )}
              </div>
              <div>
                <label className="form-label">توضیحات فارسی</label>
                <textarea
                  className="w-full min-h-[88px] px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-slate-900"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">توضیحات انگلیسی</label>
                <textarea
                  className="w-full min-h-[88px] px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-slate-900"
                  value={form.descriptionEn}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  {editOriginalSlug ? 'تصویر دسته (فایل)' : 'تصویر دسته (فایل) — الزامی'}
                </label>
                <input
                  type="file"
                  accept={ACCEPT_IMAGES}
                  onChange={onImageFileChange}
                  className="block w-full text-sm text-slate-600 file:me-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200"
                />
                <p className="text-xs text-[var(--admin-muted)] leading-relaxed">
                  فقط JPEG، PNG، GIF یا WebP؛ حداکثر {(MAX_IMAGE_BYTES / (1024 * 1024)).toLocaleString('fa-IR')} مگابایت. نوع فایل روی سرور از روی محتوا
                  (امضای باینری) کنترل می‌شود، نه فقط پسوند یا نام فایل.
                </p>
                {previewSrc && (
                  <div className="relative mt-2 h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- پیش‌نمایش ادمین؛ URL ممکن است legacy باشد */}
                    <img src={previewSrc} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                {editOriginalSlug && !imageFile && form.image && (
                  <p className="text-xs text-slate-500">در صورت عدم انتخاب فایل جدید، همان تصویر فعلی حفظ می‌شود.</p>
                )}
              </div>

              <Input
                label="آیکون (اختیاری، مثلاً ایموجی)"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
              <Input
                label="ترتیب نمایش"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                فعال در فروشگاه
              </label>
              <Input
                label="عنوان SEO (اختیاری)"
                value={form.seoTitle}
                onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
              />
              <Input
                label="توضیح SEO (اختیاری)"
                value={form.seoDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
              />

              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={closePanel}>
                  انصراف
                </Button>
                <Button type="submit" loading={saving}>
                  {editOriginalSlug ? 'ذخیرهٔ تغییرات' : 'ثبت دسته'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
