'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useApi';
import { partitionCategories } from '@/lib/category-nav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function CategoryCardImage({ src, alt }: { src: string; alt: string }) {
  const isLocal = src.startsWith('/') && !src.startsWith('//');
  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        width={280}
        height={200}
        className="categories-hub__img"
        sizes="(max-width: 768px) 100vw, 280px"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="categories-hub__img" loading="lazy" />
  );
}

export function CategoriesDesktopHub() {
  const { categories, loading, error } = useCategories({ sort: 'sortOrder' });
  const { roots } = useMemo(() => partitionCategories(categories), [categories]);

  if (loading) {
    return (
      <div className="categories-hub categories-hub--center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-hub categories-hub--center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  return (
    <section className="categories-hub">
      <div className="categories-hub__hero">
        <h1 className="categories-hub__title">دسته‌بندی محصولات</h1>
        <p className="categories-hub__desc">
          از منوی بالای صفحه هم می‌توانید سریع بین دسته‌ها جابه‌جا شوید.
        </p>
        <div className="categories-hub__actions">
          <Link
            href="/products?sort=createdAt&order=desc"
            className="categories-hub__action categories-hub__action--primary"
          >
            جدیدترین محصولات
          </Link>
          <Link href="/products" className="categories-hub__action categories-hub__action--secondary">
            همه محصولات
          </Link>
        </div>
      </div>

      <ul className="categories-hub__grid">
        {roots.map((cat) => (
          <li key={cat._id}>
            <Link href={`/categories/${cat.slug}`} className="categories-hub__card">
              <div className="categories-hub__card-media">
                <CategoryCardImage src={cat.image} alt={cat.name} />
              </div>
              <div className="categories-hub__card-body">
                <h2 className="categories-hub__card-title">{cat.name}</h2>
                {cat.productCount > 0 && (
                  <span className="categories-hub__card-meta">{cat.productCount} محصول</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
