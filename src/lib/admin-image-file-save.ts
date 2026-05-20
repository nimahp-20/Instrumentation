import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { detectImageKindFromBuffer, extensionForImageKind, type SafeImageKind } from '@/lib/image-magic-bytes';
import {
  ADMIN_IMAGE_MAX_BYTES,
  ADMIN_IMAGE_ALLOWED_MIME,
} from '@/lib/admin-image-upload-constants';

const MIME_FOR_KIND: Record<SafeImageKind, readonly string[]> = {
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  gif: ['image/gif'],
  webp: ['image/webp'],
} as const;

export { ADMIN_IMAGE_MAX_BYTES } from '@/lib/admin-image-upload-constants';

const ALLOWED_CLIENT_TYPES = ADMIN_IMAGE_ALLOWED_MIME;

export type AdminUploadSubdir = 'categories' | 'products';

export class AdminImageUploadError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'AdminImageUploadError';
  }
}

/**
 * اعتبارسنجی حجم، MIME اعلام‌شده، magic bytes و ذخیرهٔ امن در public/uploads/{subdir}.
 */
export async function validateAndSaveAdminImageFile(
  entry: File,
  subdir: AdminUploadSubdir
): Promise<{ url: string; mime: string }> {
  if (!(entry instanceof File)) {
    throw new AdminImageUploadError('فایل تصویر ارسال نشده است', 400);
  }

  if (entry.size === 0) {
    throw new AdminImageUploadError('فایل خالی است', 400);
  }

  if (entry.size > ADMIN_IMAGE_MAX_BYTES) {
    throw new AdminImageUploadError(
      `حجم فایل بیش از ${(ADMIN_IMAGE_MAX_BYTES / (1024 * 1024)).toLocaleString('fa-IR')} مگابایت مجاز نیست`,
      400
    );
  }

  if (entry.type && !ALLOWED_CLIENT_TYPES.has(entry.type)) {
    throw new AdminImageUploadError('فقط تصویر JPEG، PNG، GIF یا WebP مجاز است', 400);
  }

  const buffer = Buffer.from(await entry.arrayBuffer());

  const kind = detectImageKindFromBuffer(buffer);
  if (!kind) {
    throw new AdminImageUploadError('محتوای فایل با نوع تصویر معتبر مطابقت ندارد', 400);
  }

  if (entry.type && !MIME_FOR_KIND[kind].includes(entry.type)) {
    throw new AdminImageUploadError('نوع اعلام‌شدهٔ فایل با محتوای واقعی تصویر همخوانی ندارد', 400);
  }

  const ext = extensionForImageKind(kind);
  const fileName = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', subdir);
  await fs.mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, fileName);
  await fs.writeFile(fullPath, buffer, { mode: 0o644 });

  const publicPath = `/uploads/${subdir}/${fileName}`;
  const mime = `image/${kind === 'jpeg' ? 'jpeg' : kind}`;
  return { url: publicPath, mime };
}
