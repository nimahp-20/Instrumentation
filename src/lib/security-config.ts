/**
 * Security Configuration
 * Centralized security settings for the application
 */

export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    ACCESS_TOKEN_EXPIRES_IN: '15m', // 15 minutes
    REFRESH_TOKEN_EXPIRES_IN: '7d', // 7 days
    ISSUER: 'tools-store-app',
    AUDIENCE: 'tools-store-users',
    ALGORITHM: 'HS256' as const,
  },

  // Password Configuration
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
    BCRYPT_ROUNDS: 12,
  },

  // Rate Limiting Configuration
  RATE_LIMITS: {
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 5, // 5 attempts per window
    },
    GENERAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100, // 100 requests per window
    },
    API: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX_REQUESTS: 60, // 60 requests per minute
    },
  },

  // Input Validation Configuration
  VALIDATION: {
    EMAIL: {
      MAX_LENGTH: 254,
      MIN_LENGTH: 5,
    },
    NAME: {
      MAX_LENGTH: 50,
      MIN_LENGTH: 2,
    },
    PHONE: {
      PATTERN: /^(\+98|0)?9\d{9}$/,
    },
    GENERAL_INPUT: {
      MAX_LENGTH: 1000,
    },
  },

  // Security Headers Configuration
  SECURITY_HEADERS: {
    CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
    STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_FRAME_OPTIONS: 'DENY',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=()',
  },

  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: [
      'http://localhost:3000',
      'https://yourdomain.com', // Replace with your production domain
    ],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
    MAX_AGE: 86400, // 24 hours
    ALLOW_CREDENTIALS: true,
  },

  // Session Configuration
  SESSION: {
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    SECURE: true, // Only send cookies over HTTPS
    HTTP_ONLY: true, // Prevent XSS attacks
    SAME_SITE: 'strict' as const, // CSRF protection
  },

  // Logging Configuration
  LOGGING: {
    LOG_FAILED_ATTEMPTS: true,
    LOG_SUCCESSFUL_LOGINS: true,
    LOG_SENSITIVE_DATA: false, // Never log passwords or tokens
    LOG_IP_ADDRESSES: true,
    LOG_USER_AGENTS: true,
  },

  // Account Security Configuration
  ACCOUNT_SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    REQUIRE_EMAIL_VERIFICATION: true,
    REQUIRE_PHONE_VERIFICATION: false,
    PASSWORD_RESET_EXPIRES_IN: '1h', // 1 hour
    EMAIL_VERIFICATION_EXPIRES_IN: '24h', // 24 hours
  },

  // File Upload Security
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    SCAN_FOR_VIRUSES: false, // Enable in production
  },

  // Database Security
  DATABASE: {
    CONNECTION_TIMEOUT: 30000, // 30 seconds
    QUERY_TIMEOUT: 10000, // 10 seconds
    MAX_CONNECTIONS: 10,
    USE_SSL: true, // Enable in production
  },

  // Environment-specific settings
  ENVIRONMENT: {
    DEVELOPMENT: {
      LOG_LEVEL: 'debug',
      ENABLE_CORS_ALL_ORIGINS: true,
      DISABLE_RATE_LIMITING: false,
    },
    PRODUCTION: {
      LOG_LEVEL: 'error',
      ENABLE_CORS_ALL_ORIGINS: false,
      DISABLE_RATE_LIMITING: false,
      REQUIRE_HTTPS: true,
    },
  },
};

/**
 * Get environment-specific configuration
 */
export function getSecurityConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isDevelopment) {
    return {
      ...SECURITY_CONFIG,
      ...SECURITY_CONFIG.ENVIRONMENT.DEVELOPMENT,
    };
  }

  if (isProduction) {
    return {
      ...SECURITY_CONFIG,
      ...SECURITY_CONFIG.ENVIRONMENT.PRODUCTION,
    };
  }

  return SECURITY_CONFIG;
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig() {
  const config = getSecurityConfig();
  const errors: string[] = [];

  // Validate JWT secrets
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
    errors.push('JWT_SECRET must be set to a secure value');
  }

  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-super-secret-refresh-key-change-in-production') {
    errors.push('JWT_REFRESH_SECRET must be set to a secure value');
  }

  // Validate MongoDB URI
  if (!process.env.MONGODB_URI) {
    errors.push('MONGODB_URI must be set');
  }

  // Validate password strength
  if (config.PASSWORD.MIN_LENGTH < 8) {
    errors.push('Password minimum length should be at least 8 characters');
  }

  // Validate rate limits
  if (config.RATE_LIMITS.AUTH.MAX_REQUESTS < 3) {
    errors.push('Auth rate limit should allow at least 3 attempts');
  }

  if (errors.length > 0) {
    throw new Error(`Security configuration errors: ${errors.join(', ')}`);
  }

  return true;
}

/**
 * Security checklist for production deployment
 */
export const PRODUCTION_SECURITY_CHECKLIST = [
  '✅ JWT secrets are set to secure random values',
  '✅ MongoDB connection uses SSL/TLS',
  '✅ HTTPS is enabled and enforced',
  '✅ Rate limiting is properly configured',
  '✅ Input validation is comprehensive',
  '✅ Security headers are set',
  '✅ CORS is properly configured',
  '✅ Error messages don\'t leak sensitive information',
  '✅ Logging is configured for security events',
  '✅ File uploads are restricted and scanned',
  '✅ Database queries are parameterized',
  '✅ Session management is secure',
  '✅ Password policies are enforced',
  '✅ Account lockout is implemented',
  '✅ Email verification is required',
  '✅ Regular security updates are applied',
  '✅ Security monitoring is in place',
  '✅ Backup and recovery procedures are tested',
  '✅ Access controls are properly implemented',
  '✅ Security testing has been performed',
];

export default SECURITY_CONFIG;
