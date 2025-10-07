import { NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse, ApiError } from './types';

// Success Response Helper
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Error Response Helper
export function createErrorResponse(
  error: string | ApiError,
  status: number = 400
): NextResponse<ApiResponse> {
  const errorObj = typeof error === 'string' ? { message: error } : error;
  
  return NextResponse.json(
    {
      success: false,
      error: errorObj.message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Paginated Response Helper
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      pagination: {
        ...pagination,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    }
  );
}

// Validation Helper
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
      missingFields.push(field);
    }
  });
  
  return missingFields;
}

// Pagination Helper
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const sort = searchParams.get('sort') || 'createdAt';
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
  
  return { page, limit, sort, order };
}
