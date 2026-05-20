import { NextResponse } from 'next/server';

export const AUTH_MODE_ADMIN = 'admin';

/** 15 minutes — matches JWT access token TTL */
export const ACCESS_TOKEN_MAX_AGE = 15 * 60;

/** 7 days — matches refresh token TTL */
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export function getSecureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}

export function setAdminAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  response.cookies.set(
    'adminAccessToken',
    tokens.accessToken,
    getSecureCookieOptions(ACCESS_TOKEN_MAX_AGE)
  );
  response.cookies.set(
    'refreshToken',
    tokens.refreshToken,
    getSecureCookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
  response.cookies.set(
    'authMode',
    AUTH_MODE_ADMIN,
    getSecureCookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
}

export function setRefreshTokenCookie(response: NextResponse, refreshToken: string) {
  response.cookies.set(
    'refreshToken',
    refreshToken,
    getSecureCookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
}

/** After refresh — renew httpOnly access cookie for admin sessions */
export function setAdminAccessCookie(response: NextResponse, accessToken: string) {
  response.cookies.set(
    'adminAccessToken',
    accessToken,
    getSecureCookieOptions(ACCESS_TOKEN_MAX_AGE)
  );
}

export function clearAdminAuthCookies(response: NextResponse) {
  const expired = getSecureCookieOptions(0);
  for (const name of ['adminAccessToken', 'refreshToken', 'authMode'] as const) {
    response.cookies.set(name, '', { ...expired, maxAge: 0 });
  }
}

export function isAdminAuthMode(request: { cookies: { get: (name: string) => { value?: string } | undefined } }): boolean {
  return request.cookies.get('authMode')?.value === AUTH_MODE_ADMIN;
}
