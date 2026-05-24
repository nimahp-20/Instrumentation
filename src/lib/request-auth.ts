import { NextRequest } from 'next/server';
import { extractTokenFromHeader } from '@/lib/auth-utils';
import { isAdminAuthMode } from '@/lib/auth-cookies';

/** Admin httpOnly cookie first when in admin session, then Bearer, then legacy accessToken cookie */
export function extractAccessToken(request: NextRequest): string | null {
  const adminCookie = request.cookies.get('adminAccessToken')?.value;
  if (isAdminAuthMode(request) && adminCookie) {
    return adminCookie;
  }

  const bearer = extractTokenFromHeader(request.headers.get('authorization') || undefined);
  if (bearer) return bearer;

  return adminCookie ?? request.cookies.get('accessToken')?.value ?? null;
}

/** Admin API routes — admin httpOnly cookie first, then Bearer */
export function extractAdminAccessToken(request: NextRequest): string | null {
  const adminCookie = request.cookies.get('adminAccessToken')?.value;
  if (adminCookie) return adminCookie;

  return extractTokenFromHeader(request.headers.get('authorization') || undefined) ?? null;
}
