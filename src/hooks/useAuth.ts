import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  code?: string;
}

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/api/auth';
  private isRefreshing = false;
  private refreshPromise: Promise<ApiResponse<{ tokens: AuthTokens }>> | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Token management
  getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresIn = localStorage.getItem('tokenExpiresIn');

    if (accessToken && refreshToken && expiresIn) {
      return {
        accessToken,
        refreshToken,
        expiresIn: parseInt(expiresIn)
      };
    }
    return null;
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresIn');
  }

  // Raw API call without token refresh logic (used for refresh token calls)
  private async rawApiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for refresh token
      });

      // Handle 403 for refresh endpoint - token expired
      if (response.status === 403 && endpoint === '/refresh') {
        console.log('🚨 Refresh token expired (403), clearing auth data');
        this.clearTokens();
        this.clearUser();
        
        // Dispatch event to notify app
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authExpired'));
          // Save current URL to redirect back after login
          const currentPath = window.location.pathname + window.location.search;
          if (currentPath !== '/login' && currentPath !== '/register') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
        }
        
        return {
          success: false,
          message: 'توکن بازخوانی منقضی شده است. لطفاً مجدداً وارد شوید',
          code: 'REFRESH_TOKEN_EXPIRED'
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Raw API call error:', error);
      return {
        success: false,
        message: 'خطای شبکه - لطفاً اتصال اینترنت خود را بررسی کنید'
      };
    }
  }

  // API calls with automatic 401 interceptor and token refresh
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    console.log('🔗 apiCall called with endpoint:', endpoint);
    const tokens = this.getTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add access token to headers if available
    if (tokens?.accessToken) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for refresh token
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        const textResponse = await response.text();
        console.error('Response text:', textResponse);
        
        return {
          success: false,
          message: 'خطای سرور - پاسخ نامعتبر دریافت شد'
        };
      }

      // 401 Interceptor: If token is expired, try to refresh automatically
      if (response.status === 401 && endpoint !== '/refresh') {
        console.log('🚨 401 INTERCEPTOR TRIGGERED!');
        console.log('Endpoint:', endpoint);
        console.log('Response status:', response.status);
        console.log('Response data:', data);
        console.log('Attempting automatic token refresh...');
        
        const refreshResult = await this.ensureRefreshed();
        console.log('Refresh result:', refreshResult);
        
        if (refreshResult.success) {
          console.log('✅ Token refresh successful, retrying original request...');
          // Retry the original request with new access token
          headers.Authorization = `Bearer ${refreshResult.data!.tokens.accessToken}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          });
          const retryData = await retryResponse.json();
          console.log('✅ Retry successful, returning data:', retryData);
          return retryData;
        } else {
          console.log('❌ Token refresh failed, clearing tokens');
          // Refresh failed, clear tokens and return error
          this.clearTokens();
          return {
            success: false,
            message: 'توکن منقضی شده و امکان بازخوانی وجود ندارد'
          };
        }
      }

      return data;
    } catch (error) {
      console.error('API call error:', error);
      return {
        success: false,
        message: 'خطای شبکه - لطفاً اتصال اینترنت خود را بررسی کنید'
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    // Use rawApiCall for login to avoid token refresh logic
    const response = await this.rawApiCall<{ user: User; tokens: AuthTokens }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      // Only store access token, refresh token is in HTTP-only cookie
      this.setTokens(response.data.tokens);
    }

    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    // Use rawApiCall for register to avoid token refresh logic
    const response = await this.rawApiCall<{ user: User; tokens: AuthTokens }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      // Only store access token, refresh token is in HTTP-only cookie
      this.setTokens(response.data.tokens);
    }

    return response;
  }

  async logout(logoutAll: boolean = false): Promise<ApiResponse> {
    const response = await this.apiCall('/logout', {
      method: 'POST',
      body: JSON.stringify({ logoutAll }),
    });

    this.clearTokens();
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    console.log('🔄 refreshToken called - making request to /refresh endpoint');
    
    // Use rawApiCall to avoid circular dependency
    // Refresh token is now sent automatically via HTTP-only cookie
    const response = await this.rawApiCall<{ tokens: AuthTokens }>('/refresh', {
      method: 'POST',
    });

    console.log('🔄 refreshToken response:', response);

    if (response.success && response.data) {
      console.log('✅ Refresh successful, setting new tokens');
      this.setTokens(response.data.tokens);
    } else {
      console.log('❌ Refresh failed:', response.message);
    }

    return response;
  }

  async ensureRefreshed(): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    console.log('🔄 ensureRefreshed called');
    
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      console.log('⏳ Already refreshing, waiting for existing promise...');
      return this.refreshPromise;
    }
    
    // Check if we already have a valid token
    const tokens = this.getTokens();
    console.log('Current tokens:', tokens ? 'exists' : 'none');
    console.log('Token expired?', this.isTokenExpired());
    
    if (tokens && !this.isTokenExpired()) {
      console.log('✅ Token is still valid, no refresh needed');
      return {
        success: true,
        message: 'Token is still valid',
        data: { tokens }
      };
    }
    
    console.log('🔄 Starting token refresh...');
    this.isRefreshing = true;
    this.refreshPromise = this.refreshToken().finally(() => {
      this.isRefreshing = false;
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    console.log('👤 getProfile called - making request to /profile endpoint');
    console.log('👤 About to call apiCall with endpoint: /profile');
    const result = await this.apiCall<{ user: User }>('/profile');
    console.log('👤 getProfile result:', result);
    return result;
  }

  // Utility methods
  isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;

    const now = Math.floor(Date.now() / 1000);
    // Add small buffer to avoid races with network latency (30s)
    return now >= (tokens.expiresIn - 30);
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  }
}

export const authService = AuthService.getInstance();

// React Hook
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = authService.getTokens();
        const user = authService.getCurrentUser();


        // Check if we have tokens
        if (!tokens) {
          authService.clearTokens();
          authService.clearUser();
          setAuthState({
            user: null,
            tokens: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        // Check if tokens are expired
        if (authService.isTokenExpired()) {
          // Try to refresh token
          const refreshResult = await authService.ensureRefreshed();
          if (refreshResult.success && refreshResult.data) {
            const profileResult = await authService.getProfile();
            if (profileResult.success && profileResult.data) {
              authService.setCurrentUser(profileResult.data.user);
              setAuthState({
                user: profileResult.data.user,
                tokens: refreshResult.data.tokens,
                isLoading: false,
                isAuthenticated: true,
              });
            } else {
              authService.clearTokens();
              authService.clearUser();
              setAuthState({
                user: null,
                tokens: null,
                isLoading: false,
                isAuthenticated: false,
              });
            }
          } else {
            // Refresh failed - likely 403 expired token
            authService.clearTokens();
            authService.clearUser();
            setAuthState({
              user: null,
              tokens: null,
              isLoading: false,
              isAuthenticated: false,
            });
            // Redirect to login if refresh token expired
            if ((refreshResult as any).code === 'REFRESH_TOKEN_EXPIRED') {
              // Save current URL before redirecting
              const currentPath = window.location.pathname + window.location.search;
              if (currentPath !== '/login' && currentPath !== '/register') {
                sessionStorage.setItem('redirectAfterLogin', currentPath);
              }
              window.location.href = '/login';
            }
          }
          return;
        }

        // Check if we have a user
        if (!user) {
          const profileResult = await authService.getProfile();
          if (profileResult.success && profileResult.data) {
            authService.setCurrentUser(profileResult.data.user);
            setAuthState({
              user: profileResult.data.user,
              tokens,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            authService.clearTokens();
            authService.clearUser();
            setAuthState({
              user: null,
              tokens: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
          return;
        }

        // User is authenticated with valid tokens
        setAuthState({
          user,
          tokens,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearTokens();
        authService.clearUser();
        setAuthState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();

    // Listen for token updates from global interceptor
    const handleTokensUpdated = (event: CustomEvent) => {
      console.log('🔄 useAuth: Received tokensUpdated event from global interceptor');
      const { tokens } = event.detail;
      
      // Update the auth state with new tokens
      setAuthState(prev => ({
        ...prev,
        tokens: tokens,
      }));
    };

    // Listen for auth expiration events
    const handleAuthExpired = () => {
      console.log('🚨 useAuth: Received authExpired event');
      authService.clearTokens();
      authService.clearUser();
      setAuthState({
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    // Add event listeners
    window.addEventListener('tokensUpdated', handleTokensUpdated as EventListener);
    window.addEventListener('authExpired', handleAuthExpired as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('tokensUpdated', handleTokensUpdated as EventListener);
      window.removeEventListener('authExpired', handleAuthExpired as EventListener);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    if (response.success && response.data) {
      // Save tokens to localStorage
      authService.setTokens(response.data.tokens);
      authService.setCurrentUser(response.data.user);
      setAuthState({
        user: response.data.user,
        tokens: response.data.tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    }
    return response;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    if (response.success && response.data) {
      // Save tokens to localStorage
      authService.setTokens(response.data.tokens);
      authService.setCurrentUser(response.data.user);
      setAuthState({
        user: response.data.user,
        tokens: response.data.tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    }
    return response;
  }, []);

  const logout = useCallback(async (logoutAll: boolean = false) => {
    await authService.logout(logoutAll);
0    // Clear tokens and user from localStorage
    authService.clearTokens();
    authService.clearUser();
    setAuthState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const updateProfile = useCallback(async () => {
    console.log('🔄 updateProfile called');
    console.log('Auth state:', { isAuthenticated: authState.isAuthenticated, hasTokens: !!authState.tokens });
    
    // Only call getProfile if user is authenticated
    if (!authState.isAuthenticated || !authState.tokens) {
      console.log('❌ User not authenticated, skipping profile update');
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    console.log('✅ User authenticated, calling getProfile...');
    const response = await authService.getProfile();
    
    if (response.success && response.data) {
      authService.setCurrentUser(response.data.user);
      setAuthState(prev => ({
        ...prev,
        user: response.data!.user,
      }));
    } else if (response.message === 'توکن منقضی شده و امکان بازخوانی وجود ندارد' || (response as any).code === 'REFRESH_TOKEN_EXPIRED') {
      // Refresh token failed, user needs to login again
      authService.clearTokens();
      authService.clearUser();
      setAuthState({
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
      });
      // Save current URL before redirecting to login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login' && currentPath !== '/register') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      // Redirect to login
      window.location.href = '/login';
    }
    // For other errors, don't clear tokens - let the apiCall method handle them
    return response;
  }, [authState.isAuthenticated, authState.tokens]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    getProfile: authService.getProfile.bind(authService),
  };
}
