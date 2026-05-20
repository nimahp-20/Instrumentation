/** Fills required Product schema fields when admin creates with a minimal payload. */

export function mergeProductCreateFields(picked: Record<string, unknown>): Record<string, unknown> {
  const name = typeof picked.name === 'string' ? picked.name.trim() : '';
  const defaults: Record<string, unknown> = {
    nameEn: name,
    description: '—',
    descriptionEn: '—',
    shortDescription: (name.slice(0, 200) || '—') as string,
    shortDescriptionEn: (name.slice(0, 200) || '—') as string,
    images: ['/placeholder-product.jpg'],
    thumbnail: '/placeholder-product.jpg',
    sku: `AUTO-${Date.now()}`,
    stock: 0,
    minStock: 5,
    rating: 0,
    reviewCount: 0,
    specifications: {},
    features: [] as string[],
    tags: [] as string[],
    isActive: true,
    isFeatured: false,
    isNewProduct: false,
    isOnSale: false,
    sortOrder: 0,
  };

  const merged: Record<string, unknown> = { ...defaults, ...picked };

  const images = merged.images;
  if (!Array.isArray(images) || images.length === 0 || !images.every((x) => typeof x === 'string' && x.trim().length > 0)) {
    merged.images = ['/placeholder-product.jpg'];
  } else {
    merged.images = (images as string[]).map((u) => u.trim()).filter(Boolean);
    if ((merged.images as string[]).length === 0) merged.images = ['/placeholder-product.jpg'];
  }

  const imgs = merged.images as string[];
  merged.thumbnail =
    typeof merged.thumbnail === 'string' && merged.thumbnail.trim().length > 0
      ? merged.thumbnail.trim()
      : imgs[0];

  if (!merged.nameEn || String(merged.nameEn).trim() === '') merged.nameEn = merged.name;

  if (typeof merged.sku !== 'string' || !merged.sku.trim()) {
    merged.sku = `AUTO-${Date.now()}`;
  } else {
    merged.sku = String(merged.sku).trim().toUpperCase();
  }

  if (typeof merged.slug === 'string') {
    merged.slug = merged.slug.trim().toLowerCase();
  }

  return merged;
}
