/** Whitelist fields for admin create/update to prevent mass-assignment. */

const PRODUCT_FIELDS = [
  'name',
  'nameEn',
  'slug',
  'description',
  'descriptionEn',
  'shortDescription',
  'shortDescriptionEn',
  'category',
  'subcategory',
  'brand',
  'sku',
  'price',
  'originalPrice',
  'discount',
  'images',
  'thumbnail',
  'rating',
  'reviewCount',
  'stock',
  'minStock',
  'weight',
  'dimensions',
  'specifications',
  'features',
  'tags',
  'isActive',
  'isFeatured',
  'isNewProduct',
  'isOnSale',
  'sortOrder',
  'seoTitle',
  'seoDescription',
  'metaKeywords',
] as const;

const CATEGORY_FIELDS = [
  'name',
  'nameEn',
  'slug',
  'description',
  'descriptionEn',
  'image',
  'icon',
  'parentCategory',
  'isActive',
  'sortOrder',
  'seoTitle',
  'seoDescription',
] as const;

export function pickProductPayload(body: Record<string, unknown>): Record<string, unknown> {
  return pickAllowed(body, PRODUCT_FIELDS);
}

export function pickCategoryPayload(body: Record<string, unknown>): Record<string, unknown> {
  return pickAllowed(body, CATEGORY_FIELDS);
}

function pickAllowed(
  body: Record<string, unknown>,
  allowed: readonly string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      result[key] = body[key];
    }
  }
  return result;
}
