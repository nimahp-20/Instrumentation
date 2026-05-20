// Global fetch interceptor for automatic 401 handling

import { isAdminSession, clearAdminSessionFlag, getLoginRedirectPath } from '@/lib/auth-session';

interface RefreshTokens {
  accessToken?: string;
  expiresIn: number;
}

export interface FetchInterceptorInstance {
  interceptFetch(url: string, options?: RequestInit): Promise<Response>;
}

type FetchInterceptorWindow = Window & {
  __fetchInterceptorLoaded?: boolean;
  __fetchInterceptor?: FetchInterceptorInstance;
};

function getInterceptorWindow(): FetchInterceptorWindow {
  return window as FetchInterceptorWindow;
}

// Only run in browser environment
if (typeof window !== 'undefined') {
  // Prevent multiple interceptor registrations
  const win = getInterceptorWindow();
  if (win.__fetchInterceptorLoaded) {
    console.log('🔧 Fetch interceptor already loaded, skipping...');
  } else {
    // Store original fetch before overriding
    const originalFetch = window.fetch;

  class FetchInterceptor implements FetchInterceptorInstance {
    private static instance: FetchInterceptor;
    private isRefreshing = false;
    private refreshPromise: Promise<RefreshTokens | null> | null = null;

    static getInstance(): FetchInterceptor {
      if (!FetchInterceptor.instance) {
        FetchInterceptor.instance = new FetchInterceptor();
      }
      return FetchInterceptor.instance;
    }

    private async refreshToken(): Promise<RefreshTokens | null> {
      console.log('🔄 Global interceptor: Calling refresh token...');
      
      const response = await originalFetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json() as {
        success?: boolean;
        data?: { tokens: RefreshTokens };
      };
      console.log('🔄 Global interceptor: Refresh response:', data);

      // Handle 403 - refresh token expired/invalid
      if (response.status === 403) {
        console.log('🚨 Global interceptor: Refresh token expired (403), clearing auth and redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('user');
        clearAdminSessionFlag();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authExpired'));
          const currentPath = window.location.pathname + window.location.search;
          const loginPath = getLoginRedirectPath();
          if (
            currentPath !== '/login' &&
            currentPath !== '/register' &&
            currentPath !== '/admin/login'
          ) {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
          window.location.href = loginPath;
        }
        return null;
      }

      if (data.success && data.data) {
        const tokens = data.data.tokens;
        localStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
        if (tokens.accessToken) {
          localStorage.setItem('accessToken', tokens.accessToken);
        }
        console.log('✅ Global interceptor: Session updated');
        
        // Dispatch a custom event to notify other parts of the app
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tokensUpdated', { 
            detail: { tokens } 
          }));
        }
        
        return tokens;
      } else {
        console.log('❌ Global interceptor: Refresh failed');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('user');
        clearAdminSessionFlag();
        return null;
      }
    }

    async interceptFetch(url: string, options: RequestInit = {}): Promise<Response> {
      console.log('🔗 Global interceptor: Intercepting fetch for:', url);
      
      // Get current tokens using the same format as useAuth hook
      const accessToken = localStorage.getItem('accessToken');

      // Add authorization header if we have tokens
      if (accessToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        };
      }

      // Make the request using original fetch to avoid circular dependency
      const response = await originalFetch(url, {
        ...options,
        credentials: 'include',
      });

      // Check for 401 and handle refresh
      if (response.status === 401 && !url.includes('/refresh')) {
        console.log('🚨 Global interceptor: 401 detected, attempting refresh...');
        
        // Prevent multiple simultaneous refresh attempts
        if (this.isRefreshing && this.refreshPromise) {
          console.log('⏳ Global interceptor: Already refreshing, waiting...');
          await this.refreshPromise;
        } else {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken();
          await this.refreshPromise;
          this.isRefreshing = false;
          this.refreshPromise = null;
        }

        const newAccessToken = localStorage.getItem('accessToken');
        const adminCookieSession = isAdminSession();

        if (newAccessToken || adminCookieSession) {
          const retryHeaders: Record<string, string> = {
            ...(options.headers as Record<string, string>),
          };
          if (newAccessToken) {
            retryHeaders.Authorization = `Bearer ${newAccessToken}`;
          }
          return await originalFetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: 'include',
          });
        }

        console.log('❌ Global interceptor: Refresh failed, returning 401');
        return response;
      }

      return response;
    }
  }

  // Create global instance
  const fetchInterceptor = FetchInterceptor.getInstance();

  // Override global fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Only intercept API calls
    if (url.startsWith('/api/')) {
      return fetchInterceptor.interceptFetch(url, init);
    }
    
    // For non-API calls, use original fetch
    return originalFetch(input, init);
  };

    // Mark as loaded to prevent multiple registrations
    win.__fetchInterceptorLoaded = true;
    console.log('🔧 Global fetch interceptor loaded successfully');
    
    // Export the interceptor
    win.__fetchInterceptor = fetchInterceptor;
  }
}

// Export the interceptor (will be undefined if not loaded)
const defaultExport: FetchInterceptorInstance | null =
  typeof window !== 'undefined' ? (getInterceptorWindow().__fetchInterceptor ?? null) : null;

export default defaultExport;
