import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  if (key.length < KEY_LENGTH) {
    // Hash the key to ensure it's the right length
    return Buffer.from(createHash('sha256').update(key).digest('hex').slice(0, KEY_LENGTH * 2), 'hex');
  }
  
  return Buffer.from(key.slice(0, KEY_LENGTH * 2), 'hex');
}

// Encrypt data
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine iv, tag, and encrypted data
    return iv.toString('hex') + tag.toString('hex') + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    
    // Extract iv, tag, and encrypted data
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), 'hex');
    const tag = Buffer.from(encryptedText.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), 'hex');
    const encrypted = encryptedText.slice((IV_LENGTH + TAG_LENGTH) * 2);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Hash password with salt
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, hash] = hashedPassword.split(':');
    const passwordHash = createHash('sha256').update(password + salt).digest('hex');
    return hash === passwordHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

// Generate API key
export function generateApiKey(): string {
  const timestamp = Date.now().toString();
  const randomPart = randomBytes(16).toString('hex');
  return `ak_${timestamp}_${randomPart}`;
}

// Validate API key format
export function isValidApiKey(apiKey: string): boolean {
  const apiKeyRegex = /^ak_\d{13}_[a-f0-9]{32}$/;
  return apiKeyRegex.test(apiKey);
}

// Sanitize HTML input
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

// Validate CSRF token
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}

// Check if request is from allowed origin
export function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean);
  
  return allowedOrigins.includes(origin);
}

// Generate secure session ID
export function generateSessionId(): string {
  return generateSecureToken(48);
}

// Validate input against common injection patterns
export function validateInput(input: string): boolean {
  // Check for common SQL injection patterns
  const sqlInjectionPattern = /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i;
  if (sqlInjectionPattern.test(input)) return false;
  
  // Check for common XSS patterns
  const xssPattern = /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i;
  if (xssPattern.test(input)) return false;
  
  // Check for script tags
  const scriptPattern = /<script[^>]*>.*?<\/script>/gi;
  if (scriptPattern.test(input)) return false;
  
  return true;
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiter
export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // First request or window has expired
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }
  
  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  // Increment count
  record.count += 1;
  rateLimitStore.set(key, record);
  
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetTime: record.resetTime 
  };
}

// Clean up expired rate limit records
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// IP address validation
export function isValidIPAddress(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// URL validation
export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

// Phone number validation (basic)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Content Security Policy nonce generator
export function generateCSPNonce(): string {
  return generateSecureToken(16);
}

// Secure headers configuration
export const secureHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

// Generate Content Security Policy
export function generateCSP(nonce?: string): string {
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${nonce ? `'nonce-${nonce}'` : "'unsafe-inline'"} 'unsafe-eval' https://cdn.builder.io https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.builder.io https://cdn.builder.io https://www.google-analytics.com wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  
  return csp.join('; ');
}
