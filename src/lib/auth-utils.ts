import jwt from 'jsonwebtoken';
import { loadRuntimeEnv } from '@/lib/load-runtime-env';

const DEV_JWT_SECRET =
  'your-super-secret-jwt-key-here-make-it-long-and-random-for-development';
const DEV_JWT_REFRESH_SECRET =
  'your-super-secret-refresh-jwt-key-here-make-it-long-and-random-for-development';

let jwtSecretsWarningLogged = false;

function getJwtSecret(): string {
  loadRuntimeEnv();
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET must be set in environment variables (Liara → Environment Variables).'
    );
  }

  if (!jwtSecretsWarningLogged) {
    console.warn(
      '⚠️ JWT secrets not set in environment variables, using defaults (NOT SECURE FOR PRODUCTION)'
    );
    jwtSecretsWarningLogged = true;
  }
  return DEV_JWT_SECRET;
}

function getJwtRefreshSecret(): string {
  loadRuntimeEnv();
  const secret = process.env.JWT_REFRESH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_REFRESH_SECRET must be set in environment variables (Liara → Environment Variables).'
    );
  }

  if (!jwtSecretsWarningLogged) {
    console.warn(
      '⚠️ JWT secrets not set in environment variables, using defaults (NOT SECURE FOR PRODUCTION)'
    );
    jwtSecretsWarningLogged = true;
  }
  return DEV_JWT_REFRESH_SECRET;
}

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: 'your-app-name',
    audience: 'your-app-users',
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, getJwtRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'your-app-name',
    audience: 'your-app-users',
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtRefreshSecret()) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes('invalid signature') || msg.includes('jwt expired')) {
      // Stale cookie from old JWT secrets or expired session — expected locally
      console.warn('Refresh token rejected:', msg);
    } else {
      console.error('Refresh token verification failed:', error);
    }
    return null;
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(userId: string, email: string, role: string = 'user', tokenVersion: number = 1) {
  const accessToken = generateAccessToken({ userId, email, role });
  const refreshToken = generateRefreshToken({ userId, tokenVersion });
  
  // Calculate expiration timestamp (current time + 15 minutes)
  const expiresIn = Math.floor(Date.now() / 1000) + (15 * 60);
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
