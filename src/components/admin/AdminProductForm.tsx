'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { AdminLink } from '@/components/admin/AdminLink';
import { useRouter } from 'next/navigation';
import {
  ADMIN_IMAGE_MAX_BYTES,
  ADMIN_IMAGE_ACCEPT_ATTR,
  ADMIN_IMAGE_ALLOWED_MIME,
} from '@/lib/admin-image-upload-constants';
import { slugFromProductFields } from '@/lib/slugify';
import { AdminLoadingBlock } from '@/components/admin/AdminLoading';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

type CategoryOption = { _id: string; name: string; slug?: string };

type FormState = {
  name: string;
  nameEn: string;
  slug: string;
  sku: string;
  price: string;
  discountPercent: string;
  stock: string;
  isActive: boolean;
  category: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  imagesText: string;
  thumbnail: string;
};

const emptyForm: FormState = {
  name: '',
  nameEn: '',
  slug: '',
  sku: '',
  price: '',
  discountPercent: '0',
  stock: '0',
  isActive: true,
  category: '',
  description: '',
  descriptionEn: '',
  shortDescription: '',
  shortDescriptionEn: '',
  imagesText: '',
  thumbnail: '',
};

function parseImages(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function validateClientImageFile(file: File): string | null {
  if (file.size === 0) return 'فایل خالی است';
  if (file.size > ADMIN_IMAGE_MAX_BYTES) {
    return `حجم هر تصویر حداکثر ${ADMIN_IMAGE_MAX_BYTES / (1024 * 1024)} مگابایت است`;
  }
  if (file.type && !ADMIN_IMAGE_ALLOWED_MIME.has(file.type)) {
    return 'فقط تصویر JPEG، PNG، GIF یا WebP مجاز است';
  }
  return null;
}

async function uploadProductImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload/product-image', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'آپلود تصویر ناموفق بود');
  }
  return data.data.url as string;
}

export function AdminProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { runAsync } = useAdminLoading();
  const isEdit = Boolean(productId);
  const slugTouchedRef = useRef(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadedGalleryUrls, setUploadedGalleryUrls] = useState<string[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = useCallback(async () => {
    await runAsync(async () => {
      const res = await fetch('/api/categories?all=1', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(
          data.data.map((c: { _id: string; name: string; slug?: string }) => ({
            _id: String(c._id),
            name: c.name,
            slug: c.slug,
          }))
        );
      }
    }, 'در حال بارگذاری دسته‌ها...');
  }, [runAsync]);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError('');
    slugTouchedRef.current = true;
    try {
      await runAsync(async () => {
      const res = await fetch(`/api/admin/products/${productId}`, { credentials: 'include' });
      const data = await res.json();
      if (!data.success || !data.product) {
        setError(data.message || 'محصول یافت نشد');
        return;
      }
      const p = data.product;
      const catId =
        p.category && typeof p.category === 'object' && p.category._id
          ? String(p.category._id)
          : String(p.category || '');
      const imgs: string[] = Array.isArray(p.images) ? p.images : [];
      const original =
        p.originalPrice != null && p.originalPrice > 0 ? Math.round(p.originalPrice) : null;
      const sale = p.price != null ? Math.round(p.price) : 0;
      const basePrice = original != null && original > sale ? original : sale;
      let discountPercent = 0;
      if (original != null && original > sale) {
        discountPercent =
          p.discount != null && p.discount > 0
            ? Math.round(p.discount)
            : Math.round(((original - sale) / original) * 100);
      } else if (p.discount != null && p.discount > 0) {
        discountPercent = Math.round(p.discount);
      }
      setUploadedGalleryUrls(imgs);
      setForm({
        name: p.name || '',
        nameEn: p.nameEn || '',
        slug: p.slug || '',
        sku: p.sku || '',
        price: String(basePrice),
        discountPercent: String(discountPercent),
        stock: p.stock != null ? String(p.stock) : '0',
        isActive: Boolean(p.isActive),
        category: catId,
        description: p.description || '',
        descriptionEn: p.descriptionEn || '',
        shortDescription: p.shortDescription || '',
        shortDescriptionEn: p.shortDescriptionEn || '',
        imagesText: '',
        thumbnail: p.thumbnail || '',
      });
      }, 'در حال بارگذاری محصول...');
    } catch {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  }, [productId, runAsync]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [isEdit, loadProduct]);

  const applyAutoSlug = (name: string, nameEn: string) => {
    if (isEdit || slugTouchedRef.current) return;
    const slug = slugFromProductFields(name, nameEn);
    if (slug) setForm((f) => ({ ...f, slug }));
  };

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (!isEdit && !slugTouchedRef.current && (key === 'name' || key === 'nameEn')) {
        const name = key === 'name' ? String(value) : f.name;
        const nameEn = key === 'nameEn' ? String(value) : f.nameEn;
        const slug = slugFromProductFields(name, nameEn);
        if (slug) next.slug = slug;
      }
      return next;
    });
  };

  const handleGalleryFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setGalleryUploading(true);
    setError('');
    try {
      await runAsync(async () => {
        for (const file of files) {
          const err = validateClientImageFile(file);
          if (err) {
            setError(`${file.name}: ${err}`);
            continue;
          }
          const url = await uploadProductImageFile(file);
          setUploadedGalleryUrls((prev) => [...prev, url]);
        }
      }, 'در حال آپلود تصاویر...');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'آپلود تصویر ناموفق');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleThumbnailFile = async (file: File | null) => {
    if (!file) return;
    const err = validateClientImageFile(file);
    if (err) {
      setError(`تصویر شاخص: ${err}`);
      return;
    }
    setThumbUploading(true);
    setError('');
    try {
      await runAsync(async () => {
        const url = await uploadProductImageFile(file);
        setForm((f) => ({ ...f, thumbnail: url }));
      }, 'در حال آپلود تصویر شاخص...');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'آپلود تصویر شاخص ناموفق');
    } finally {
      setThumbUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const price = parseFloat(form.price);
    const discountPercent = parseInt(form.discountPercent, 10);
    const stock = parseInt(form.stock, 10);
    if (!form.name.trim() || !form.slug.trim() || !form.category) {
      setError('نام، اسلاگ و دسته الزامی است.');
      setSaving(false);
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setError('قیمت معتبر وارد کنید.');
      setSaving(false);
      return;
    }
    if (Number.isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      setError('درصد تخفیف باید عددی بین ۰ تا ۱۰۰ باشد.');
      setSaving(false);
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      setError('موجودی معتبر وارد کنید.');
      setSaving(false);
      return;
    }

    const fromText = parseImages(form.imagesText);
    const images = [...new Set([...uploadedGalleryUrls, ...fromText])];
    if (images.length === 0) {
      setError('حداقل یک تصویر لازم است — فایل بارگذاری کنید یا آدرس تصویر وارد کنید.');
      setSaving(false);
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim() || form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim() || '—',
      descriptionEn: form.descriptionEn.trim() || '—',
      shortDescription: (form.shortDescription.trim() || form.name.trim()).slice(0, 200),
      shortDescriptionEn: (form.shortDescriptionEn.trim() || form.name.trim()).slice(0, 200),
      category: form.category,
      price,
      discountPercent,
      stock,
      isActive: form.isActive,
      images,
      thumbnail: (form.thumbnail.trim() || images[0]) as string,
    };

    if (isEdit && form.sku.trim()) {
      payload.sku = form.sku.trim();
    }
    if (!isEdit && form.sku.trim()) {
      payload.sku = form.sku.trim();
    }

    const saveMessage = isEdit ? 'در حال ذخیرهٔ تغییرات...' : 'در حال ثبت محصول...';

    try {
      await runAsync(async () => {
        if (isEdit && productId) {
          const res = await fetch(`/api/admin/products/${productId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!data.success) {
            setError(data.message || data.error || 'ذخیره نشد');
            return;
          }
          router.push('/admin/products?toast=product-updated');
          router.refresh();
          return;
        }

        const res = await fetch('/api/products', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || data.message || 'ایجاد محصول انجام نشد');
          return;
        }
        router.push('/admin/products?toast=product-created');
        router.refresh();
      }, saveMessage);
    } catch {
      setError('خطا در اتصال به سرور');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card overflow-hidden">
        <AdminLoadingBlock message="در حال بارگذاری فرم محصول..." />
      </div>
    );
  }

  const allPreviewUrls = [...uploadedGalleryUrls, ...parseImages(form.imagesText)];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      <div className="admin-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">اطلاعات اصلی</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">نام فارسی</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">نام انگلیسی</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.nameEn}
              onChange={(e) => update('nameEn', e.target.value)}
              placeholder="برای اسلاگ بهتر"
            />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">اسلاگ</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
              value={form.slug}
              onChange={(e) => {
                slugTouchedRef.current = true;
                update('slug', e.target.value);
              }}
              required
            />
            {!isEdit ? (
              <button
                type="button"
                className="text-xs text-sky-700 font-medium hover:underline"
                onClick={() => {
                  slugTouchedRef.current = false;
                  applyAutoSlug(form.name, form.nameEn);
                }}
              >
                ساخت دوبارهٔ اسلاگ از نام
              </button>
            ) : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">SKU {isEdit ? '' : '(اختیاری)'}</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
              value={form.sku}
              onChange={(e) => update('sku', e.target.value)}
              placeholder={isEdit ? '' : 'خالی بگذارید تا خودکار ساخته شود'}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">دسته‌بندی</span>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              required
            >
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 pt-6">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
            <span className="text-sm font-medium text-slate-700">محصول فعال در فروشگاه</span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">قیمت اصلی (تومان)</span>
            <input
              type="number"
              min={0}
              step="1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tabular-nums"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
            <span className="text-xs text-[var(--admin-muted)]">قبل از تخفیف؛ مبنای محاسبه درصد</span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">درصد تخفیف</span>
            <input
              type="number"
              min={0}
              max={100}
              step="1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tabular-nums"
              value={form.discountPercent}
              onChange={(e) => update('discountPercent', e.target.value)}
            />
            <span className="text-xs text-[var(--admin-muted)]">
              مثلاً ۲۰ یعنی ۲۰٪ کمتر از قیمت اصلی؛ ۰ = بدون تخفیف
            </span>
            {(() => {
              const base = parseFloat(form.price);
              const pct = parseInt(form.discountPercent, 10);
              if (Number.isNaN(base) || base < 0 || Number.isNaN(pct) || pct <= 0 || pct > 100) return null;
              const final = Math.round(base * (1 - pct / 100));
              return (
                <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 tabular-nums">
                  قیمت فروش: {final.toLocaleString('fa-IR')} تومان
                </p>
              );
            })()}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">موجودی</span>
            <input
              type="number"
              min={0}
              step="1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tabular-nums"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
              required
            />
          </label>
        </div>
      </div>

      <div className="admin-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">توضیحات</h2>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">توضیح فارسی</span>
          <textarea
            className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">توضیح انگلیسی</span>
          <textarea
            className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.descriptionEn}
            onChange={(e) => update('descriptionEn', e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">خلاصه فارسی</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              maxLength={200}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">خلاصه انگلیسی</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.shortDescriptionEn}
              onChange={(e) => update('shortDescriptionEn', e.target.value)}
              maxLength={200}
            />
          </label>
        </div>
      </div>

      <div className="admin-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">تصاویر</h2>
        <p className="text-xs text-[var(--admin-muted)]">
          پس از انتخاب فایل، تصویر بلافاصله آپلود و پیش‌نمایش می‌شود (JPEG/PNG/GIF/WebP تا{' '}
          {ADMIN_IMAGE_MAX_BYTES / (1024 * 1024)} مگابایت).
        </p>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">بارگذاری گالری (چند فایل)</span>
          <input
            ref={galleryInputRef}
            type="file"
            accept={ADMIN_IMAGE_ACCEPT_ATTR}
            multiple
            disabled={galleryUploading}
            className="block w-full text-sm text-slate-600 file:me-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200 disabled:opacity-50"
            onChange={(e) => {
              const list = Array.from(e.target.files ?? []);
              e.target.value = '';
              void handleGalleryFiles(list);
            }}
          />
          {galleryUploading ? (
            <p className="text-xs text-slate-500">در حال آپلود تصاویر...</p>
          ) : null}
          {uploadedGalleryUrls.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {uploadedGalleryUrls.map((url) => (
                <li
                  key={url}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden aspect-square"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-1.5 start-1.5 rounded-md bg-red-600/90 text-white text-[10px] px-2 py-0.5 hover:bg-red-700"
                    onClick={() => setUploadedGalleryUrls((prev) => prev.filter((u) => u !== url))}
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">آدرس تصاویر (هر خط یا با کاما) — اختیاری</span>
          <textarea
            className="w-full min-h-[80px] rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
            value={form.imagesText}
            onChange={(e) => update('imagesText', e.target.value)}
            placeholder="/uploads/products/... یا آدرس خارجی"
          />
        </label>

        {allPreviewUrls.length > 0 && form.imagesText.trim() ? (
          <p className="text-xs text-[var(--admin-muted)]">
            {allPreviewUrls.length.toLocaleString('fa-IR')} تصویر در مجموع (آپلود + آدرس دستی)
          </p>
        ) : null}

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">تصویر شاخص</span>
          <input
            ref={thumbInputRef}
            type="file"
            accept={ADMIN_IMAGE_ACCEPT_ATTR}
            disabled={thumbUploading}
            className="block w-full text-sm text-slate-600 file:me-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200 disabled:opacity-50"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              e.target.value = '';
              if (!f) return;
              void handleThumbnailFile(f);
            }}
          />
          {thumbUploading ? <p className="text-xs text-slate-500">در حال آپلود تصویر شاخص...</p> : null}
          {form.thumbnail ? (
            <div className="relative mt-2 h-36 max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.thumbnail} alt="" className="w-full h-full object-contain" />
              <button
                type="button"
                className="absolute top-2 start-2 rounded-md bg-red-600/90 text-white text-xs px-2 py-1 hover:bg-red-700"
                onClick={() => update('thumbnail', '')}
              >
                حذف
              </button>
            </div>
          ) : null}
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">آدرس تصویر شاخص (دستی)</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
            value={form.thumbnail}
            onChange={(e) => update('thumbnail', e.target.value)}
            placeholder="خالی = اولین تصویر گالری"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || galleryUploading || thumbUploading}
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-60 bg-sky-600 hover:bg-sky-700"
        >
          {saving ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ایجاد محصول'}
        </button>
        <AdminLink
          href="/admin/products"
          loadingMessage="در حال بازگشت..."
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          انصراف
        </AdminLink>
      </div>
    </form>
  );
}
