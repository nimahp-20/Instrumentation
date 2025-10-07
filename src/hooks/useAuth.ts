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

  // API calls
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const tokens = this.getTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (tokens?.accessToken) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // If token is expired, try to refresh
      if (response.status === 401 && tokens?.refreshToken && endpoint !== '/refresh') {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          // Retry the original request with new token
          headers.Authorization = `Bearer ${refreshResult.data!.tokens.accessToken}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
          });
          return await retryResponse.json();
        } else {
          // Refresh failed, clear tokens
          this.clearTokens();
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
    const response = await this.apiCall<{ user: User; tokens: AuthTokens }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.tokens);
    }

    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.apiCall<{ user: User; tokens: AuthTokens }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
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
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      return {
        success: false,
        message: 'توکن بازخوانی یافت نشد'
      };
    }

    const response = await this.apiCall<{ tokens: AuthTokens }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.tokens);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.apiCall<{ user: User }>('/profile');
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

        if (tokens && user && !authService.isTokenExpired()) {
          setAuthState({
            user,
            tokens,
            isLoading: false,
            isAuthenticated: true,
          });
        } else if (tokens && authService.isTokenExpired()) {
          // Try to refresh token
          const refreshResult = await authService.refreshToken();
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
          setAuthState({
            user: null,
            tokens: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
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
    const response = await authService.getProfile();
    if (response.success && response.data) {
      authService.setCurrentUser(response.data.user);
      setAuthState(prev => ({
        ...prev,
        user: response.data!.user,
      }));
    }
    return response;
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
}
