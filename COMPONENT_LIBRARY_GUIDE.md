# 🧩 Component Library Documentation

## 📋 Overview

This document provides comprehensive documentation for the reusable component library built for the Persian e-commerce website. The component system is designed for better performance, maintainability, and developer experience.

## 🏗️ Component Architecture

### 📁 Directory Structure

```
src/components/
├── ui/                    # Basic UI components
│   ├── index.tsx          # Core UI components (Button, Card, Input, etc.)
│   └── advanced.tsx       # Advanced UI components (Modal, Dropdown, Search, Pagination)
├── sections/              # Page section components
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── CategoriesSection.tsx
│   ├── FeaturedProductsSection.tsx
│   ├── NewsletterSection.tsx
│   └── index.tsx
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LayoutComponents.tsx
├── forms/                 # Form components
│   └── index.tsx
└── index.tsx              # Main export file
```

## 🎨 UI Components

### Basic Components

#### Button
```tsx
import { Button } from '@/components/ui';

<Button 
  variant="primary" 
  size="lg" 
  loading={false}
  onClick={() => console.log('clicked')}
>
  دکمه
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean

#### Card
```tsx
import { Card } from '@/components/ui';

<Card hover className="p-6">
  محتوای کارت
</Card>
```

**Props:**
- `hover`: boolean (adds hover effects)
- `className`: string

#### Input
```tsx
import { Input } from '@/components/ui';

<Input 
  label="نام کاربری"
  placeholder="نام کاربری خود را وارد کنید"
  error="این فیلد الزامی است"
  helperText="حداقل ۳ کاراکتر"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string

#### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">
  موفق
</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md'

#### ProductCard
```tsx
import { ProductCard } from '@/components/ui';

<ProductCard 
  product={productData}
  onAddToCart={(id) => console.log('Add to cart:', id)}
  onViewProduct={(slug) => console.log('View product:', slug)}
/>
```

### Advanced Components

#### Modal
```tsx
import { Modal } from '@/components/ui';

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="عنوان مودال"
  size="lg"
>
  محتوای مودال
</Modal>
```

#### Dropdown
```tsx
import { Dropdown } from '@/components/ui';

<Dropdown 
  trigger={<button>منوی کشویی</button>}
  align="right"
>
  <div className="p-2">
    <button>گزینه ۱</button>
    <button>گزینه ۲</button>
  </div>
</Dropdown>
```

#### Search
```tsx
import { Search } from '@/components/ui';

<Search 
  placeholder="جستجو در محصولات..."
  onSearch={(query) => console.log('Search:', query)}
  suggestions={['دریل', 'آچار', 'کلاه ایمنی']}
/>
```

#### Pagination
```tsx
import { Pagination } from '@/components/ui';

<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
  maxVisiblePages={5}
/>
```

## 📄 Section Components

### HeroSection
```tsx
import { HeroSection } from '@/components/sections';

<HeroSection 
  title="ابزارهای حرفه‌ای برای"
  subtitle="هر پروژه‌ای"
  description="توضیحات محصولات..."
  primaryButtonText="خرید کنید"
  secondaryButtonText="مشاهده دسته‌بندی‌ها"
  imageSrc="/hero-tools.jpg"
  imageAlt="ابزارهای حرفه‌ای"
  discountBadge="-۳۰٪ تخفیف"
  freeShippingBadge="ارسال رایگان"
  onPrimaryClick={() => console.log('Primary clicked')}
  onSecondaryClick={() => console.log('Secondary clicked')}
/>
```

### FeaturesSection
```tsx
import { FeaturesSection } from '@/components/sections';

const features = [
  {
    icon: <svg>...</svg>,
    title: "ارسال رایگان",
    description: "ارسال رایگان برای سفارشات بالای ۵۰ دلار"
  }
];

<FeaturesSection features={features} />
```

### CategoriesSection
```tsx
import { CategoriesSection } from '@/components/sections';

const categories = [
  {
    name: "ابزارهای برقی",
    image: "/category-power-tools.jpg",
    count: "۱۵۰+ محصول",
    href: "/categories/power-tools"
  }
];

<CategoriesSection 
  categories={categories}
  title="خرید بر اساس دسته‌بندی"
  description="توضیحات دسته‌بندی‌ها..."
/>
```

### FeaturedProductsSection
```tsx
import { FeaturedProductsSection } from '@/components/sections';

<FeaturedProductsSection 
  products={productsData}
  title="محصولات ویژه"
  description="محصولات محبوب..."
  viewAllText="مشاهده همه محصولات"
  onAddToCart={(id) => console.log('Add to cart:', id)}
  onViewProduct={(slug) => console.log('View product:', slug)}
  onViewAll={() => console.log('View all')}
/>
```

### NewsletterSection
```tsx
import { NewsletterSection } from '@/components/sections';

<NewsletterSection 
  title="به‌روز بمانید"
  description="در خبرنامه ما عضو شوید..."
  placeholder="آدرس ایمیل خود را وارد کنید"
  buttonText="عضویت"
  onSubmit={(email) => console.log('Subscribe:', email)}
/>
```

## 🏗️ Layout Components

### Container
```tsx
import { Container } from '@/components/layout/LayoutComponents';

<Container maxWidth="7xl" padding="md">
  محتوای صفحه
</Container>
```

### Section
```tsx
import { Section } from '@/components/layout/LayoutComponents';

<Section padding="lg" background="gray">
  محتوای بخش
</Section>
```

### Grid
```tsx
import { Grid } from '@/components/layout/LayoutComponents';

<Grid cols={3} gap="md" responsive>
  <div>آیتم ۱</div>
  <div>آیتم ۲</div>
  <div>آیتم ۳</div>
</Grid>
```

### Flex
```tsx
import { Flex } from '@/components/layout/LayoutComponents';

<Flex direction="row" justify="center" align="center" gap="md">
  <div>آیتم ۱</div>
  <div>آیتم ۲</div>
</Flex>
```

## 📝 Form Components

### Form
```tsx
import { Form } from '@/components/forms';

<Form onSubmit={(data) => console.log('Form submitted:', data)}>
  <input name="username" />
  <button type="submit">ارسال</button>
</Form>
```

### Select
```tsx
import { Select } from '@/components/forms';

<Select 
  label="دسته‌بندی"
  options={[
    { value: 'power-tools', label: 'ابزارهای برقی' },
    { value: 'hand-tools', label: 'ابزارهای دستی' }
  ]}
  placeholder="دسته‌بندی را انتخاب کنید"
/>
```

### Textarea
```tsx
import { Textarea } from '@/components/forms';

<Textarea 
  label="توضیحات"
  placeholder="توضیحات خود را بنویسید..."
  rows={4}
  resize="vertical"
/>
```

### Checkbox & Radio
```tsx
import { Checkbox, Radio } from '@/components/forms';

<Checkbox label="قوانین را می‌پذیرم" />
<Radio label="گزینه ۱" name="option" value="1" />
```

## 🚀 Usage Examples

### Complete Page Example
```tsx
'use client';

import React from 'react';
import { 
  HeroSection, 
  FeaturesSection, 
  CategoriesSection, 
  FeaturedProductsSection, 
  NewsletterSection 
} from '@/components/sections';

const HomePage = () => {
  const heroData = {
    title: "ابزارهای حرفه‌ای برای",
    subtitle: "هر پروژه‌ای",
    description: "توضیحات...",
    primaryButtonText: "خرید کنید",
    secondaryButtonText: "مشاهده دسته‌بندی‌ها",
    imageSrc: "/hero-tools.jpg",
    imageAlt: "ابزارهای حرفه‌ای",
    onPrimaryClick: () => console.log('Primary clicked'),
    onSecondaryClick: () => console.log('Secondary clicked'),
  };

  const featuresData = [
    {
      icon: <svg>...</svg>,
      title: "ارسال رایگان",
      description: "ارسال رایگان برای سفارشات بالای ۵۰ دلار"
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection {...heroData} />
      <FeaturesSection features={featuresData} />
      <CategoriesSection 
        categories={categoriesData}
        title="خرید بر اساس دسته‌بندی"
        description="توضیحات دسته‌بندی‌ها..."
      />
      <FeaturedProductsSection 
        products={productsData}
        title="محصولات ویژه"
        description="محصولات محبوب..."
        viewAllText="مشاهده همه محصولات"
        onAddToCart={(id) => console.log('Add to cart:', id)}
        onViewProduct={(slug) => console.log('View product:', slug)}
      />
      <NewsletterSection 
        title="به‌روز بمانید"
        description="در خبرنامه ما عضو شوید..."
        placeholder="آدرس ایمیل خود را وارد کنید"
        buttonText="عضویت"
        onSubmit={(email) => console.log('Subscribe:', email)}
      />
    </div>
  );
};

export default HomePage;
```

## 🎯 Benefits

### ✅ Performance Benefits
- **Code Splitting**: Components are lazy-loaded when needed
- **Reusability**: Reduces bundle size through component reuse
- **Tree Shaking**: Unused components are eliminated from the bundle
- **Memoization**: Components can be memoized for better performance

### ✅ Developer Experience
- **Type Safety**: Full TypeScript support with proper interfaces
- **Consistency**: Standardized component API across the application
- **Maintainability**: Easy to update and modify components
- **Documentation**: Comprehensive prop documentation

### ✅ User Experience
- **Accessibility**: Built-in accessibility features
- **Responsive**: Mobile-first responsive design
- **Persian Support**: Full RTL and Persian language support
- **Modern UI**: Clean and professional design

## 🔧 Customization

### Theme Customization
Components use Tailwind CSS classes that can be customized through the `tailwind.config.ts` file:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
      },
      fontFamily: {
        'iran-sans': ['IRANSansX', 'sans-serif'],
      },
    },
  },
};
```

### Component Customization
All components accept a `className` prop for additional styling:

```tsx
<Button className="bg-red-500 hover:bg-red-600">
  دکمه سفارشی
</Button>
```

## 📚 Best Practices

1. **Import Only What You Need**: Use specific imports to reduce bundle size
2. **Use TypeScript**: Leverage TypeScript for better development experience
3. **Follow Naming Conventions**: Use consistent naming for props and components
4. **Handle Loading States**: Always provide loading states for better UX
5. **Accessibility**: Ensure all components are accessible
6. **Responsive Design**: Test components on different screen sizes
7. **Error Handling**: Implement proper error handling in components

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to import from the correct path
2. **TypeScript Errors**: Check that all required props are provided
3. **Styling Issues**: Verify Tailwind CSS is properly configured
4. **RTL Issues**: Ensure RTL support is enabled in the layout

### Getting Help

- Check the component props documentation above
- Review the TypeScript interfaces for proper typing
- Test components in isolation before integration
- Use browser dev tools to debug styling issues

---

**🎉 Happy Coding!** This component library provides a solid foundation for building scalable and maintainable Persian e-commerce applications.
