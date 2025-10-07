import crypto from 'crypto';

/**
 * Security utilities for input validation, sanitization, and rate limiting
 */

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
export function rateLimit(options: {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
}) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (req: Request): { allowed: boolean; remaining: number; resetTime: number } => {
    const key = keyGenerator ? keyGenerator(req) : getClientIP(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);
    
    if (!current || current.resetTime < now) {
      // New window or expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      };
    }

    // Increment counter
    current.count++;
    rateLimitStore.set(key, current);

    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    };
  };
}

/**
 * Get client IP address
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * Input sanitization
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Email-specific sanitization (less aggressive)
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 254); // Email max length
}

/**
 * Email validation with comprehensive checks
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'ایمیل الزامی است' };
  }

  const sanitizedEmail = sanitizeEmail(email);
  
  if (sanitizedEmail.length < 5) {
    return { valid: false, error: 'ایمیل باید حداقل ۵ کاراکتر باشد' };
  }

  if (sanitizedEmail.length > 254) {
    return { valid: false, error: 'ایمیل نباید بیش از ۲۵۴ کاراکتر باشد' };
  }

  // Check if email contains @ symbol
  if (!sanitizedEmail.includes('@')) {
    return { valid: false, error: 'ایمیل باید شامل @ باشد' };
  }

  // Split email into local and domain parts
  const parts = sanitizedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'ایمیل باید فقط یک @ داشته باشد' };
  }

  const [localPart, domainPart] = parts;

  // Validate local part
  if (localPart.length === 0) {
    return { valid: false, error: 'قسمت قبل از @ نمی‌تواند خالی باشد' };
  }

  if (localPart.length > 64) {
    return { valid: false, error: 'قسمت قبل از @ نباید بیش از ۶۴ کاراکتر باشد' };
  }

  // Validate domain part
  if (domainPart.length === 0) {
    return { valid: false, error: 'قسمت بعد از @ نمی‌تواند خالی باشد' };
  }

  if (domainPart.length > 253) {
    return { valid: false, error: 'قسمت بعد از @ نباید بیش از ۲۵۳ کاراکتر باشد' };
  }

  // Check for valid characters in local part
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(localPart)) {
    return { valid: false, error: 'قسمت قبل از @ شامل کاراکترهای نامعتبر است' };
  }

  // Check for valid characters in domain part
  const domainPartRegex = /^[a-zA-Z0-9.-]+$/;
  if (!domainPartRegex.test(domainPart)) {
    return { valid: false, error: 'قسمت بعد از @ شامل کاراکترهای نامعتبر است' };
  }

  // Check for consecutive dots
  if (sanitizedEmail.includes('..')) {
    return { valid: false, error: 'ایمیل نمی‌تواند شامل دو نقطه متوالی باشد' };
  }

  // Check if domain has at least one dot
  if (!domainPart.includes('.')) {
    return { valid: false, error: 'قسمت بعد از @ باید شامل حداقل یک نقطه باشد' };
  }

  // Check if domain doesn't start or end with dot or hyphen
  if (domainPart.startsWith('.') || domainPart.endsWith('.') || 
      domainPart.startsWith('-') || domainPart.endsWith('-')) {
    return { valid: false, error: 'قسمت بعد از @ نمی‌تواند با نقطه یا خط تیره شروع یا تمام شود' };
  }

  // Check if local part doesn't start or end with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'قسمت قبل از @ نمی‌تواند با نقطه شروع یا تمام شود' };
  }

  return { valid: true };
}

/**
 * Password strength validation
 */
export function validatePassword(password: string): { valid: boolean; error?: string; strength: 'weak' | 'medium' | 'strong' } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'رمز عبور الزامی است', strength: 'weak' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد', strength: 'weak' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'رمز عبور نباید بیش از ۱۲۸ کاراکتر باشد', strength: 'weak' };
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'password1', 'qwerty123', 'dragon', 'master'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, error: 'رمز عبور انتخاب شده بسیار ضعیف است. لطفاً رمز عبور قوی‌تری انتخاب کنید', strength: 'weak' };
  }

  // Calculate password strength
  let score = 0;
  let missingRequirements: string[] = [];
  
  // Length bonus
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  else missingRequirements.push('حروف کوچک');
  
  if (/[A-Z]/.test(password)) score += 1;
  else missingRequirements.push('حروف بزرگ');
  
  if (/[0-9]/.test(password)) score += 1;
  else missingRequirements.push('اعداد');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 2;
  else missingRequirements.push('نمادها');
  
  // Patterns penalty
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns

  let strength: 'weak' | 'medium' | 'strong';
  if (score >= 6) strength = 'strong';
  else if (score >= 4) strength = 'medium';
  else strength = 'weak';

  if (strength === 'weak') {
    const requirements = missingRequirements.length > 0 
      ? `رمز عبور باید شامل ${missingRequirements.join('، ')} باشد`
      : 'رمز عبور باید قوی‌تر باشد';
    return { valid: false, error: requirements, strength };
  }

  return { valid: true, strength };
}

/**
 * Phone number validation for Iranian numbers
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true }; // Phone is optional
  
  const sanitizedPhone = sanitizeInput(phone);
  
  // Remove all non-digit characters for validation
  const digitsOnly = sanitizedPhone.replace(/\D/g, '');
  
  // Check if it's empty after removing non-digits
  if (digitsOnly.length === 0) {
    return { valid: false, error: 'شماره تلفن باید شامل اعداد باشد' };
  }
  
  // Iranian mobile number validation
  if (digitsOnly.length === 11 && digitsOnly.startsWith('09')) {
    return { valid: true };
  }
  
  if (digitsOnly.length === 13 && digitsOnly.startsWith('989')) {
    return { valid: true };
  }
  
  if (digitsOnly.length === 10 && digitsOnly.startsWith('9')) {
    return { valid: true };
  }
  
  return { valid: false, error: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)' };
}

/**
 * Name validation
 */
export function validateName(name: string, fieldName: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} الزامی است` };
  }

  const sanitized = sanitizeInput(name);
  
  if (sanitized.length < 2) {
    return { valid: false, error: `${fieldName} باید حداقل ۲ کاراکتر باشد` };
  }

  if (sanitized.length > 50) {
    return { valid: false, error: `${fieldName} نباید بیش از ۵۰ کاراکتر باشد` };
  }

  // Check for valid characters (Persian, English, space, dash)
  const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s\-]+$/;
  
  if (!nameRegex.test(sanitized)) {
    return { valid: false, error: `${fieldName} باید فقط شامل حروف فارسی یا انگلیسی باشد` };
  }

  // Check for consecutive spaces
  if (sanitized.includes('  ')) {
    return { valid: false, error: `${fieldName} نمی‌تواند شامل فاصله‌های متوالی باشد` };
  }

  // Check if name starts or ends with space
  if (sanitized.startsWith(' ') || sanitized.endsWith(' ')) {
    return { valid: false, error: `${fieldName} نمی‌تواند با فاصله شروع یا تمام شود` };
  }

  return { valid: true };
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data for logging
 */
export function hashSensitiveData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
}

/**
 * Check for SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /['";\-\/\*\|%\+\=\<\>\[\]\(\)\\\^\$\?\!\@\#\&\~\`]/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)/i,
    /(or|and)\s+\d+\s*=\s*\d+/i,
    /(or|and)\s+['"]\s*=\s*['"]/i
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /@import/i
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input validation
 */
export function validateInput(input: string, type: 'email' | 'password' | 'name' | 'phone' | 'general', fieldName?: string): { valid: boolean; error?: string; sanitized?: string } {
  // For email, name, and password validation, skip malicious pattern checks as they contain special characters
  if (type === 'email') {
    const emailResult = validateEmail(input);
    return { ...emailResult, sanitized: sanitizeEmail(input) };
  }

  if (type === 'name') {
    const nameResult = validateName(input, fieldName || 'نام');
    return { ...nameResult, sanitized: sanitizeInput(input) };
  }

  if (type === 'password') {
    const passwordResult = validatePassword(input);
    return { ...passwordResult, sanitized: sanitizeInput(input) };
  }

  // First check for malicious patterns for other input types
  if (containsSQLInjection(input)) {
    return { valid: false, error: 'ورودی نامعتبر است' };
  }

  if (containsXSS(input)) {
    return { valid: false, error: 'ورودی نامعتبر است' };
  }

  const sanitized = sanitizeInput(input);

  switch (type) {
    case 'phone':
      const phoneResult = validatePhone(sanitized);
      return { ...phoneResult, sanitized };
    
    case 'general':
      if (sanitized.length === 0) {
        return { valid: false, error: 'این فیلد الزامی است', sanitized };
      }
      return { valid: true, sanitized };
    
    default:
      return { valid: true, sanitized };
  }
}
