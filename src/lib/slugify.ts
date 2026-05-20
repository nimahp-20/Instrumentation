/** ساخت اسلاگ URL-safe از متن لاتین */
export function slugFromLatinText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** اولویت: نام انگلیسی، سپس حروف لاتین نام فارسی، در غیر این صورت شناسهٔ کوتاه */
export function slugFromProductFields(name: string, nameEn: string): string {
  const fromEn = slugFromLatinText(nameEn);
  if (fromEn) return fromEn;
  const fromName = slugFromLatinText(name);
  if (fromName) return fromName;
  if (name.trim()) {
    return `product-${Date.now().toString(36)}`;
  }
  return '';
}
