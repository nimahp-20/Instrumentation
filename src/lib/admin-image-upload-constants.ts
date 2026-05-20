/** ثابت‌های مشترک آپلود تصویر ادمین (بدون وابستگی به Node) — برای کلاینت و سرور */

export const ADMIN_IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export const ADMIN_IMAGE_ACCEPT_ATTR = 'image/jpeg,image/png,image/gif,image/webp';

export const ADMIN_IMAGE_ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
