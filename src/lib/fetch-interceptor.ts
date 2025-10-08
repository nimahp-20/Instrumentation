// Global fetch interceptor for automatic 401 handling

// Only run in browser environment
if (typeof window !== 'undefined') {
  // Prevent multiple interceptor registrations
  if ((window as any).__fetchInterceptorLoaded) {
    console.log('🔧 Fetch interceptor already loaded, skipping...');
  } else {
    // Store original fetch before overriding
    const originalFetch = window.fetch;

  class FetchInterceptor {
    private static instance: FetchInterceptor;
    private isRefreshing = false;
    private refreshPromise: Promise<any> | null = null;

    static getInstance(): FetchInterceptor {
      if (!FetchInterceptor.instance) {
        FetchInterceptor.instance = new FetchInterceptor();
      }
      return FetchInterceptor.instance;
    }

    private async refreshToken(): Promise<any> {
      console.log('🔄 Global interceptor: Calling refresh token...');
      
      const response = await originalFetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      console.log('🔄 Global interceptor: Refresh response:', data);

      // Handle 403 - refresh token expired/invalid
      if (response.status === 403) {
        console.log('🚨 Global interceptor: Refresh token expired (403), clearing auth and redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('user');
        
        // Dispatch event to notify app
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authExpired'));
          // Save current URL to redirect back after login
          const currentPath = window.location.pathname + window.location.search;
          if (currentPath !== '/login' && currentPath !== '/register') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
          // Redirect to login page
          window.location.href = '/login';
        }
        return null;
      }

      if (data.success && data.data) {
        // Update tokens in localStorage using the same format as useAuth hook
        const tokens = data.data.tokens;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
        // Note: refreshToken is not stored in localStorage, it's in HTTP-only cookie
        console.log('✅ Global interceptor: Tokens updated in localStorage');
        
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
        return null;
      }
    }

    async interceptFetch(url: string, options: RequestInit = {}): Promise<Response> {
      console.log('🔗 Global interceptor: Intercepting fetch for:', url);
      
      // Get current tokens using the same format as useAuth hook
      const accessToken = localStorage.getItem('accessToken');
      const expiresIn = localStorage.getItem('tokenExpiresIn');

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

        // Get updated tokens using the same format as useAuth hook
        const newAccessToken = localStorage.getItem('accessToken');

        if (newAccessToken) {
          console.log('✅ Global interceptor: Retrying request with new token...');
          // Retry the original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newAccessToken}`,
            },
            credentials: 'include' as RequestCredentials,
          };
          return await originalFetch(url, retryOptions);
        } else {
          console.log('❌ Global interceptor: Refresh failed, returning 401');
          return response;
        }
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
    (window as any).__fetchInterceptorLoaded = true;
    console.log('🔧 Global fetch interceptor loaded successfully');
    
    // Export the interceptor
    (window as any).__fetchInterceptor = fetchInterceptor;
  }
}

// Export the interceptor (will be undefined if not loaded)
export default (typeof window !== 'undefined' ? (window as any).__fetchInterceptor : null);