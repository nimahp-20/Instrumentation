const UPLOAD_PREFIX = '/uploads/categories/';

/**
 * مقدار مجاز برای فیلد تصویر دسته در API:
 * - مسیر آپلود داخلی (یک segment، بدون traversal)
 * - یا URLهای http/https برای داده‌های قدیمی / seed
 */
export function isAllowedCategoryImageValue(image: unknown): image is string {
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

  if (t.startsWith(UPLOAD_PREFIX)) {
    const name = t.slice(UPLOAD_PREFIX.length);
    if (!name || name.includes('/') || name.includes('\\')) return false;
    if (name.includes('..')) return false;
    return /^[a-zA-Z0-9._-]+$/.test(name);
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
