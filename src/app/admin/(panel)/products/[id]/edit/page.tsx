import Link from 'next/link';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ویرایش محصول</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">شناسه: {id}</p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-[var(--admin-primary)] hover:text-[var(--admin-header-deep)]"
        >
          ← بازگشت به فهرست
        </Link>
      </header>
      <AdminProductForm productId={id} />
    </div>
  );
}
