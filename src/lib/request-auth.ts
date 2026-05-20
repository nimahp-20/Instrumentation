import { NextRequest } from 'next/server';
import { extractTokenFromHeader } from '@/lib/auth-utils';

/** Bearer header, then admin httpOnly cookie, then optional legacy accessToken cookie */
export function extractAccessToken(request: NextRequest): string | null {
  const bearer = extractTokenFromHeader(request.headers.get('authorization') || undefined);
  if (bearer) return bearer;

  return (
    request.cookies.get('adminAccessToken')?.value ??
    request.cookies.get('accessToken')?.value ??
    null
  );
}

/** Admin API routes — only admin httpOnly cookie or Bearer (no localStorage-only user tokens) */
export function extractAdminAccessToken(request: NextRequest): string | null {
  const bearer = extractTokenFromHeader(request.headers.get('authorization') || undefined);
  if (bearer) return bearer;

  return request.cookies.get('adminAccessToken')?.value ?? null;
}
