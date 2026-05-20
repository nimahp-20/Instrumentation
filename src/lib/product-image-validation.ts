const UPLOAD_PRODUCTS = '/uploads/products/';

/**
 * مقدار مجاز برای آدرس تصویر محصول در API:
 * - آپلود ادمین زیر /uploads/products/
 * - یا مسیر تک‌بخشی زیر public (مثل /placeholder-product.jpg)
 * - یا URL http/https
 */
export function isAllowedProductImageUrl(image: unknown): image is string {
  if (typeof image !== 'string') return false;
  const t = image.trim();
  if (t.length === 0 || t.length > 2048) return false;
  const lower = t.toLowerCase();
  if (
    lower.startsWith('data:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.includes('<') ||
    lower.includes('\n') ||
    lower.includes('\r')
  ) {
    return false;
  }

  if (t.startsWith(UPLOAD_PRODUCTS)) {
    const name = t.slice(UPLOAD_PRODUCTS.length);
    if (!name || name.includes('/') || name.includes('\\')) return false;
    if (name.includes('..')) return false;
    return /^[a-zA-Z0-9._-]+$/.test(name);
  }

  if (t.startsWith('/') && !t.startsWith('//')) {
    if (t.includes('..')) return false;
    const rest = t.slice(1);
    if (!rest || rest.includes('/')) return false;
    return /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(rest);
  }

  try {
    const u = new URL(t);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (!u.hostname || u.hostname.length === 0) return false;
    return true;
  } catch {
    return false;
  }
}

export function assertProductImageUrlsAllowed(urls: unknown[], fieldLabel: string): string | null {
  if (!Array.isArray(urls)) return `${fieldLabel} باید آرایه باشد`;
  for (const u of urls) {
    if (!isAllowedProductImageUrl(u)) {
      return `آدرس تصویر نامعتبر یا غیرمجاز در ${fieldLabel}`;
    }
  }
  return null;
}
