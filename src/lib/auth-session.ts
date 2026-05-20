/** Client-side flag: admin uses httpOnly cookies instead of localStorage access token */

export const AUTH_MODE_KEY = 'authMode';
export const AUTH_MODE_ADMIN = 'admin';

export function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_MODE_KEY) === AUTH_MODE_ADMIN;
}

export function setAdminSessionFlag(): void {
  sessionStorage.setItem(AUTH_MODE_KEY, AUTH_MODE_ADMIN);
}

export function clearAdminSessionFlag(): void {
  sessionStorage.removeItem(AUTH_MODE_KEY);
}

export function getLoginRedirectPath(): string {
  if (typeof window === 'undefined') return '/login';
  const currentPath = window.location.pathname + window.location.search;
  return currentPath.startsWith('/admin') ? '/admin/login' : '/login';
}
