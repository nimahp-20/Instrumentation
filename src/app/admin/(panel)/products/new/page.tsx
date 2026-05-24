import { AdminLink } from '@/components/admin/AdminLink';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">محصول جدید</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">اطلاعات را تکمیل کنید و ذخیره کنید.</p>
        </div>
        <AdminLink
          href="/admin/products"
          loadingMessage="در حال بازگشت به فهرست..."
          className="text-sm font-medium text-[var(--admin-primary)] hover:text-[var(--admin-header-deep)]"
        >
          ← بازگشت به فهرست
        </AdminLink>
      </header>
      <AdminProductForm />
    </div>
  );
}
