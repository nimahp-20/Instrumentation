'use client';

import { useState, useEffect } from 'react';

// Types
export interface Category {
  _id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  image: string;
  icon?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  category: Category | string;
  subcategory?: Category | string;
  brand?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  specifications: { [key: string]: string };
  features: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

// Base URL for API calls (can be empty for same-origin)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Custom hook for fetching categories
export function useCategories(options?: {
  featured?: boolean;
  limit?: number;
  sort?: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (options?.featured) params.append('featured', 'true');
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.sort) params.append('sort', options.sort);
        
        const response = await fetch(`${API_BASE_URL}/api/categories?${params}`);
        const result: ApiResponse<Category[]> = await response.json();
        
        if (result.success) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [options?.featured, options?.limit, options?.sort]);

  return { categories, loading, error };
}

// Custom hook for searching categories
export function useCategorySearch(query: string, options?: {
  limit?: number;
  debounceMs?: number;
}) {
  const [results, setResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('q', query);
        if (options?.limit) params.append('limit', options.limit.toString());
        
        const response = await fetch(`${API_BASE_URL}/api/categories/search?${params}`);
        const result: ApiResponse<Category[]> = await response.json();
        
        if (result.success) {
          setResults(result.data);
        } else {
          setError(result.error || 'Failed to search categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, options?.debounceMs || 300);

    return () => clearTimeout(timeoutId);
  }, [query, options?.limit, options?.debounceMs]);

  return { results, loading, error };
}

// Global search (products + categories)
export function useGlobalSearch(query: string, options?: { limit?: number; debounceMs?: number; }) {
  const [results, setResults] = useState<{ products: Product[]; categories: Category[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ products: [], categories: [] });
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('q', query);
        if (options?.limit) params.append('limit', String(options.limit));

        const response = await fetch(`${API_BASE_URL}/api/search?${params}`);
        const json = await response.json();
        if (json.success) {
          setResults(json.data);
        } else {
          setError(json.error || 'Search failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, options?.debounceMs ?? 300);

    return () => clearTimeout(timeoutId);
  }, [query, options?.limit, options?.debounceMs]);

  return { results, loading, error };
}

// Custom hook for fetching products
export function useProducts(options?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  new?: boolean;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse<Product[]>['pagination']>(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (options?.page) params.append('page', options.page.toString());
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.category) params.append('category', options.category);
        if (options?.featured) params.append('featured', 'true');
        if (options?.new) params.append('new', 'true');
        if (options?.onSale) params.append('onSale', 'true');
        if (options?.minPrice) params.append('minPrice', options.minPrice.toString());
        if (options?.maxPrice) params.append('maxPrice', options.maxPrice.toString());
        if (options?.minRating) params.append('minRating', options.minRating.toString());
        if (options?.brand) params.append('brand', options.brand);
        if (options?.inStock !== undefined) params.append('inStock', options.inStock.toString());
        if (options?.sort) params.append('sort', options.sort);
        if (options?.order) params.append('order', options.order);
        if (options?.search) params.append('search', options.search);
        
        const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
        const result: any = await response.json();
        
        if (result.success) {
          // API returns 'products' not 'data'
          setProducts(result.products || result.data || []);
          setPagination(result.pagination || undefined);
        } else {
          setError(result.error || 'Failed to fetch products');
          setProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    options?.page,
    options?.limit,
    options?.category,
    options?.featured,
    options?.new,
    options?.onSale,
    options?.minPrice,
    options?.maxPrice,
    options?.minRating,
    options?.brand,
    options?.inStock,
    options?.sort,
    options?.order,
    options?.search
  ]);

  return { products, loading, error, pagination };
}

// Custom hook for fetching a single product
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
        const result: ApiResponse<Product> = await response.json();
        
        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}

// Custom hook for fetching a single category
export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/categories/${slug}`);
        const result: ApiResponse<Category> = await response.json();
        
        if (result.success) {
          setCategory(result.data);
        } else {
          setError(result.error || 'Failed to fetch category');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
}

// Utility function to seed database
export async function seedDatabase() {
  try {
    const response = await fetch('/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to seed database');
    }
  } catch (error) {
    throw error;
  }
}
