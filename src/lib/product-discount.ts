/** قیمت پایه و درصد تخفیف ادمین → فیلدهای ذخیره‌شده در محصول */

export type ProductPricingFields = {
  price: number;
  originalPrice?: number;
  discount: number;
  isOnSale: boolean;
};

export function parseDiscountPercent(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return 0;
  const n = typeof value === 'number' ? value : parseInt(String(value).trim(), 10);
  if (Number.isNaN(n) || n < 0 || n > 100) return null;
  return n;
}

/** قیمت پایه (بدون تخفیف) و درصد فعلی برای نمایش در فرم */
export function resolveProductBasePriceAndDiscount(product: {
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
}): { basePrice: number; discountPercent: number } {
  const sale = Math.max(0, Math.round(product.price));
  const original =
    product.originalPrice != null && product.originalPrice > 0
      ? Math.round(product.originalPrice)
      : null;

  if (original != null && original > sale) {
    const pct =
      product.discount != null && product.discount > 0
        ? Math.round(product.discount)
        : Math.round(((original - sale) / original) * 100);
    return { basePrice: original, discountPercent: Math.min(100, Math.max(0, pct)) };
  }

  if (product.discount != null && product.discount > 0) {
    return { basePrice: sale, discountPercent: Math.round(product.discount) };
  }

  return { basePrice: sale, discountPercent: 0 };
}

/** اعمال درصد روی قیمت پایه؛ ۰ = حذف تخفیف */
export function applyProductDiscountPricing(
  basePrice: number,
  discountPercent: number
): ProductPricingFields {
  const base = Math.max(0, Math.round(basePrice));
  const pct = Math.min(100, Math.max(0, Math.round(discountPercent)));

  if (pct <= 0) {
    return {
      price: base,
      originalPrice: undefined,
      discount: 0,
      isOnSale: false,
    };
  }

  const salePrice = Math.max(0, Math.round(base * (1 - pct / 100)));
  return {
    price: salePrice,
    originalPrice: base,
    discount: pct,
    isOnSale: true,
  };
}

/** اگر `discountPercent` در بدنه باشد، قیمت/تخفیف را از قیمت پایه (`price`) محاسبه می‌کند */
export function mergeDiscountPercentIntoProductPayload(
  payload: Record<string, unknown>,
  discountPercent: number,
  fallbackBasePrice?: number
): { ok: true } | { ok: false; message: string } {
  const baseRaw =
    payload.price !== undefined && payload.price !== null
      ? Number(payload.price)
      : fallbackBasePrice;

  if (baseRaw === undefined || Number.isNaN(baseRaw) || baseRaw < 0) {
    return { ok: false, message: 'قیمت پایه معتبر وارد کنید.' };
  }

  const pricing = applyProductDiscountPricing(baseRaw, discountPercent);
  payload.price = pricing.price;
  payload.discount = pricing.discount;
  payload.isOnSale = pricing.isOnSale;

  if (pricing.originalPrice != null) {
    payload.originalPrice = pricing.originalPrice;
  } else {
    payload.originalPrice = null;
  }

  return { ok: true };
}
