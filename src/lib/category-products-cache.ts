import type { Product } from '@/hooks/useApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const DEFAULT_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  products: Product[];
  fetchedAt: number;
};

type FetchOptions = {
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  ttlMs?: number;
};

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<Product[]>>();

export function categoryProductsCacheKey(
  slug: string,
  limit: number,
  sort: string,
  order: string,
): string {
  return `${slug}|${limit}|${sort}|${order}`;
}

export function getCachedCategoryProducts(
  slug: string,
  limit: number,
  sort: string,
  order: string,
  ttlMs = DEFAULT_TTL_MS,
): Product[] | null {
  const key = categoryProductsCacheKey(slug, limit, sort, order);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > ttlMs) {
    cache.delete(key);
    return null;
  }
  return entry.products;
}

export async function fetchCategoryProductsCached(
  slug: string,
  options: FetchOptions = {},
): Promise<Product[]> {
  const limit = options.limit ?? 12;
  const sort = options.sort ?? 'createdAt';
  const order = options.order ?? 'desc';
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const key = categoryProductsCacheKey(slug, limit, sort, order);

  const hit = getCachedCategoryProducts(slug, limit, sort, order, ttlMs);
  if (hit) return hit;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const promise = (async () => {
    const params = new URLSearchParams({
      category: slug,
      limit: String(limit),
      sort,
      order,
    });

    const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products');
    }

    const products: Product[] = result.products || result.data || [];
    cache.set(key, { products, fetchedAt: Date.now() });
    return products;
  })();

  inFlight.set(key, promise);

  try {
    return await promise;
  } finally {
    inFlight.delete(key);
  }
}

/** پیش‌بارگذاری بی‌صدا — برای باز شدن مگا منو / لیست دسته‌ها */
export function prefetchCategoryProducts(
  slugs: string[],
  options: FetchOptions = {},
): void {
  const unique = [...new Set(slugs.filter(Boolean))];
  for (const slug of unique) {
    const limit = options.limit ?? 12;
    const sort = options.sort ?? 'createdAt';
    const order = options.order ?? 'desc';
    if (getCachedCategoryProducts(slug, limit, sort, order)) continue;
    if (inFlight.has(categoryProductsCacheKey(slug, limit, sort, order))) continue;
    fetchCategoryProductsCached(slug, options).catch(() => {});
  }
}
