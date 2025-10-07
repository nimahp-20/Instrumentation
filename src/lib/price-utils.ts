/**
 * Persian Toman Price Formatting Utilities
 * Formats Toman prices with proper Persian formatting
 */

/**
 * Format number with Persian digits and thousand separators
 * @param number - Number to format
 * @returns Formatted string with Persian digits
 */
export function formatPersianNumber(number: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Convert to string and add thousand separators
  const formatted = number.toLocaleString('fa-IR');
  
  // Convert English digits to Persian digits
  return formatted.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * Format price in Persian Toman with proper formatting
 * @param tomanPrice - Price in Toman (already in Toman, no conversion needed)
 * @returns Formatted price string
 */
export function formatPrice(tomanPrice: number): string {
  const formattedToman = formatPersianNumber(tomanPrice);
  return `${formattedToman} تومان`;
}

/**
 * Format price range for products with original and sale prices
 * @param currentPrice - Current price in Toman
 * @param originalPrice - Original price in Toman (optional)
 * @returns Formatted price range string
 */
export function formatPriceRange(currentPrice: number, originalPrice?: number): {
  current: string;
  original?: string;
  discount?: string;
} {
  const result: {
    current: string;
    original?: string;
    discount?: string;
  } = {
    current: formatPrice(currentPrice)
  };

  if (originalPrice && originalPrice > currentPrice) {
    result.original = formatPrice(originalPrice);
    
    // Calculate discount percentage
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    result.discount = `${formatPersianNumber(discountPercent)}٪ تخفیف`;
  }

  return result;
}

/**
 * Format currency with Persian Toman symbol
 * @param amount - Amount in Toman
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `${formatPersianNumber(amount)} تومان`;
}

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param number - Number to format
 * @returns Formatted number with unit
 */
export function formatLargeNumber(number: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  if (number >= 1000000000) {
    const billions = (number / 1000000000).toFixed(1);
    return `${billions.replace(/\d/g, (digit) => persianDigits[parseInt(digit)])} میلیارد`;
  } else if (number >= 1000000) {
    const millions = (number / 1000000).toFixed(1);
    return `${millions.replace(/\d/g, (digit) => persianDigits[parseInt(digit)])} میلیون`;
  } else if (number >= 1000) {
    const thousands = (number / 1000).toFixed(1);
    return `${thousands.replace(/\d/g, (digit) => persianDigits[parseInt(digit)])} هزار`;
  }
  
  return formatPersianNumber(number);
}

/**
 * Format stock quantity with Persian text
 * @param stock - Stock quantity
 * @param minStock - Minimum stock threshold
 * @returns Formatted stock status
 */
export function formatStockStatus(stock: number, minStock: number = 5): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  if (stock === 0) {
    return 'ناموجود';
  } else if (stock <= minStock) {
    return `کم موجود (${formatPersianNumber(stock)} عدد)`;
  } else {
    return `موجود (${formatPersianNumber(stock)} عدد)`;
  }
}

/**
 * Format rating with Persian text
 * @param rating - Rating value (0-5)
 * @param reviewCount - Number of reviews
 * @returns Formatted rating string
 */
export function formatRating(rating: number, reviewCount: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  const formattedRating = rating.toFixed(1).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  const formattedCount = formatPersianNumber(reviewCount);
  
  return `${formattedRating} از ۵ (${formattedCount} نظر)`;
}
