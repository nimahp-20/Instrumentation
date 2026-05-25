import type { Category, Product } from '@/hooks/useApi';

export const NEWEST_SIDEBAR_ID = '__newest__';
export const ALL_PRODUCTS_SIDEBAR_ID = '__all__';

export type SidebarSelectionId = typeof NEWEST_SIDEBAR_ID | typeof ALL_PRODUCTS_SIDEBAR_ID | string;

export function getCategoryParentId(category: Category): string | undefined {
  const parent = category.parentCategory;
  if (!parent) return undefined;
  if (typeof parent === 'string') return parent;
  if (typeof parent === 'object' && parent !== null && '_id' in parent) {
    return String((parent as { _id: string })._id);
  }
  return undefined;
}

export function partitionCategories(categories: Category[]) {
  const roots: Category[] = [];
  const childrenByParent = new Map<string, Category[]>();

  for (const cat of categories) {
    const parentId = getCategoryParentId(cat);
    if (!parentId) {
      roots.push(cat);
      continue;
    }
    const list = childrenByParent.get(parentId) ?? [];
    list.push(cat);
    childrenByParent.set(parentId, list);
  }

  roots.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'fa'));
  for (const list of childrenByParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'fa'));
  }

  return { roots, childrenByParent };
}

export function getSidebarLabel(selectionId: SidebarSelectionId, categories: Category[]): string {
  if (selectionId === NEWEST_SIDEBAR_ID) return 'جدیدترین\u200cها';
  if (selectionId === ALL_PRODUCTS_SIDEBAR_ID) return 'همه محصولات';
  return categories.find((c) => c._id === selectionId)?.name ?? 'دسته\u200cبندی';
}

export function getAllProductsHref(selectionId: SidebarSelectionId, categories: Category[]): string {
  if (selectionId === NEWEST_SIDEBAR_ID) {
    return '/products?sort=createdAt&order=desc';
  }
  if (selectionId === ALL_PRODUCTS_SIDEBAR_ID) {
    return '/products';
  }
  const cat = categories.find((c) => c._id === selectionId);
  return cat ? `/categories/${cat.slug}` : '/products';
}

export type CategoryGridCell = {
  id: string;
  name: string;
  image: string;
  href: string;
};

export function isSpecialSidebarSelection(selectionId: SidebarSelectionId): boolean {
  return selectionId === NEWEST_SIDEBAR_ID || selectionId === ALL_PRODUCTS_SIDEBAR_ID;
}

/** زیردسته دارد → گرید زیردسته؛ وگرنه گرید محصولات */
export function shouldShowSubcategoryGrid(
  selectionId: SidebarSelectionId,
  childrenByParent: Map<string, Category[]>,
): boolean {
  if (isSpecialSidebarSelection(selectionId)) return false;
  return (childrenByParent.get(selectionId) ?? []).length > 0;
}

export function getSelectedCategorySlug(
  selectionId: SidebarSelectionId,
  categories: Category[],
  childrenByParent: Map<string, Category[]>,
): string | null {
  if (isSpecialSidebarSelection(selectionId)) return null;
  if (shouldShowSubcategoryGrid(selectionId, childrenByParent)) return null;
  return categories.find((c) => c._id === selectionId)?.slug ?? null;
}

export function productsToGridCells(products: Product[]): CategoryGridCell[] {
  return products.map((product) => ({
    id: product._id,
    name: product.name,
    image: product.thumbnail || product.images[0] || '/logo.svg',
    href: `/products/${product.slug}`,
  }));
}

export function buildCategoryGrid(
  selectionId: SidebarSelectionId,
  categories: Category[],
  roots: Category[],
  childrenByParent: Map<string, Category[]>,
): CategoryGridCell[] {
  if (selectionId === NEWEST_SIDEBAR_ID || selectionId === ALL_PRODUCTS_SIDEBAR_ID) {
    return roots.map((cat) => ({
      id: cat._id,
      name:
        selectionId === NEWEST_SIDEBAR_ID
          ? `جدیدترین\u200cهای ${cat.name}`
          : cat.name,
      image: cat.image,
      href: `/categories/${cat.slug}`,
    }));
  }

  const children = childrenByParent.get(selectionId) ?? [];
  if (children.length > 0) {
    return children.map((cat) => ({
      id: cat._id,
      name: cat.name,
      image: cat.image,
      href: `/categories/${cat.slug}`,
    }));
  }

  return [];
}
