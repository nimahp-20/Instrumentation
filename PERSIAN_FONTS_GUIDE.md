# Persian Font Integration Guide

## IRANSansX Font Family Setup

Your Persian e-commerce website now uses the **IRANSansX** font family for optimal Persian typography.

### 🎯 **Available Font Weights**

| Weight | Class | Value | Usage |
|--------|-------|-------|-------|
| Thin | `font-thin` | 100 | Very light text |
| Ultra Light | `font-ultra-light` | 200 | Light headings |
| Light | `font-light` | 300 | Subtle text |
| Regular | `font-regular` | 400 | Body text (default) |
| Medium | `font-medium` | 500 | UI elements |
| Demi Bold | `font-demi-bold` | 600 | Subheadings |
| Bold | `font-bold` | 700 | Headings |
| Extra Bold | `font-extra-bold` | 800 | Strong emphasis |
| Black | `font-black` | 900 | Heavy headings |
| Extra Black | `font-extra-black` | 950 | Maximum emphasis |
| Heavy | `font-heavy` | 1000 | Ultra heavy text |

### 🎨 **Font Usage Examples**

#### **Basic Usage**
```tsx
// Using Tailwind classes
<h1 className="font-iran-sans font-bold text-4xl">
  عنوان اصلی
</h1>

<p className="font-iran-sans font-regular text-base">
  متن پاراگراف با فونت فارسی
</p>
```

#### **Using Font Utilities**
```tsx
import { commonFonts } from '@/lib/font-utils';

// Persian headings
<h1 className={commonFonts.persianH1}>
  عنوان اصلی
</h1>

<h2 className={commonFonts.persianH2}>
  عنوان فرعی
</h2>

// Persian body text
<p className={commonFonts.persianBody}>
  متن پاراگراف
</p>

// Persian buttons
<button className={commonFonts.persianButton}>
  دکمه فارسی
</button>
```

#### **Custom Font Combinations**
```tsx
import { combineFontClasses } from '@/lib/font-utils';

// Custom combination
<div className={combineFontClasses('font-iran-sans', 'font-medium', 'text-lg', 'leading-relaxed')}>
  متن سفارشی
</div>
```

### 📝 **CSS Variables**

You can also use CSS variables directly:

```css
.custom-text {
  font-family: var(--font-iran-sans);
  font-weight: var(--font-weight-medium);
}
```

### 🎯 **Common Use Cases**

#### **1. Headings**
```tsx
// H1 - Main headings
<h1 className="font-iran-sans font-bold text-4xl leading-tight">
  فروشگاه ابزار
</h1>

// H2 - Section headings
<h2 className="font-iran-sans font-bold text-3xl leading-tight">
  محصولات ویژه
</h2>

// H3 - Subsection headings
<h3 className="font-iran-sans font-bold text-2xl leading-snug">
  دسته‌بندی‌ها
</h3>
```

#### **2. Body Text**
```tsx
// Regular body text
<p className="font-iran-sans font-regular text-base leading-relaxed">
  متن پاراگراف با فونت فارسی و خط فاصله مناسب
</p>

// Large body text
<p className="font-iran-sans font-regular text-lg leading-relaxed">
  متن بزرگ‌تر برای خوانایی بهتر
</p>
```

#### **3. UI Elements**
```tsx
// Buttons
<button className="font-iran-sans font-medium text-base">
  افزودن به سبد
</button>

// Labels
<label className="font-iran-sans font-medium text-sm">
  نام محصول
</label>

// Captions
<span className="font-iran-sans font-regular text-xs">
  توضیحات کوچک
</span>
```

#### **4. Navigation**
```tsx
// Navigation links
<Link href="/categories" className="font-iran-sans font-medium text-base hover:text-blue-600">
  دسته‌بندی‌ها
</Link>
```

### 🔧 **Font Configuration Files**

#### **1. Font CSS** (`src/styles/fonts.css`)
- Contains all `@font-face` declarations
- CSS variables for easy usage
- Utility classes

#### **2. Font Utilities** (`src/lib/font-utils.ts`)
- Pre-defined font combinations
- Utility functions
- Type-safe font classes

#### **3. Tailwind Config** (`tailwind.config.ts`)
- Font family configuration
- Font weight mappings
- Font size definitions

#### **4. Global CSS** (`src/app/globals.css`)
- Default font family
- Persian typography enhancements
- Text rendering optimizations

### 🎨 **Best Practices**

#### **1. Font Weight Guidelines**
- **Headings**: Use `font-bold` (700) or `font-extra-bold` (800)
- **Body Text**: Use `font-regular` (400) or `font-medium` (500)
- **UI Elements**: Use `font-medium` (500) for buttons and labels
- **Captions**: Use `font-regular` (400) with smaller sizes

#### **2. Line Height Guidelines**
- **Headings**: Use `leading-tight` (1.25) or `leading-snug` (1.375)
- **Body Text**: Use `leading-relaxed` (1.625) for better readability
- **UI Elements**: Use `leading-normal` (1.5)

#### **3. Size Guidelines**
- **H1**: `text-4xl` (36px) or `text-5xl` (48px)
- **H2**: `text-3xl` (30px) or `text-4xl` (36px)
- **H3**: `text-2xl` (24px) or `text-3xl` (30px)
- **Body**: `text-base` (16px) or `text-lg` (18px)
- **Small Text**: `text-sm` (14px) or `text-xs` (12px)

### 🚀 **Performance Optimization**

The fonts are optimized for performance with:
- **Font Display**: `swap` for better loading experience
- **Font Smoothing**: Antialiased rendering
- **Text Rendering**: Optimized for Persian text
- **Fallback Fonts**: System fonts as fallbacks

### 📱 **Responsive Typography**

```tsx
// Responsive font sizes
<h1 className="font-iran-sans font-bold text-2xl md:text-4xl lg:text-5xl">
  عنوان واکنش‌گرا
</h1>

<p className="font-iran-sans font-regular text-sm md:text-base lg:text-lg">
  متن واکنش‌گرا
</p>
```

### 🎯 **Quick Reference**

```tsx
// Most common combinations
const commonStyles = {
  heading: 'font-iran-sans font-bold text-3xl leading-tight',
  subheading: 'font-iran-sans font-bold text-2xl leading-snug',
  body: 'font-iran-sans font-regular text-base leading-relaxed',
  button: 'font-iran-sans font-medium text-base',
  label: 'font-iran-sans font-medium text-sm',
  caption: 'font-iran-sans font-regular text-xs',
};
```

Your Persian e-commerce website now has professional typography with the IRANSansX font family! 🎉
