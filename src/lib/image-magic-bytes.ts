/** تشخیص نوع تصویر فقط از روی بایت‌های ابتدای فایل (بدون اعتماد به MIME مرورگر). */

export type SafeImageKind = 'jpeg' | 'png' | 'gif' | 'webp';

export function detectImageKindFromBuffer(buf: Buffer): SafeImageKind | null {
  if (buf.length < 12) return null;

  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';

  // PNG
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'png';
  }

  // GIF87a / GIF89a — "GIF" + "8" + ("7"|"9") + "a"
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    buf[5] === 0x61 &&
    (buf[4] === 0x37 || buf[4] === 0x39)
  ) {
    return 'gif';
  }

  // WebP (RIFF....WEBP)
  if (
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
}

export function extensionForImageKind(kind: SafeImageKind): string {
  switch (kind) {
    case 'jpeg':
      return '.jpg';
    case 'png':
      return '.png';
    case 'gif':
      return '.gif';
    case 'webp':
      return '.webp';
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
