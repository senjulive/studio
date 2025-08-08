import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class CustomError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'CustomError';
  }
}

export class ValidationError extends CustomError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends CustomError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

export function createErrorResponse(
  error: Error,
  request?: NextRequest
): NextResponse<ErrorResponse> {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  // Handle different error types
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid input data';
    details = error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  }

  const errorResponse: ErrorResponse = {
    error: {
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request?.nextUrl.pathname,
      ...(details && { details }),
    },
  };

  // Log error for monitoring (exclude sensitive information)
  if (statusCode >= 500) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      path: request?.nextUrl.pathname,
      method: request?.method,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Async error handler wrapper for API routes
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = args[0] as NextRequest;
      return createErrorResponse(error as Error, request);
    }
  };
}

// Middleware error handler
export function handleMiddlewareError(error: Error, request: NextRequest): NextResponse {
  console.error('Middleware Error:', {
    message: error.message,
    stack: error.stack,
    path: request.nextUrl.pathname,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  // For middleware errors, we typically want to continue or redirect
  if (error instanceof UnauthorizedError) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  // For other errors, return a generic error response
  return createErrorResponse(error, request);
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return true;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return false;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(key: string): Date {
    const requests = this.requests.get(key) || [];
    if (requests.length === 0) {
      return new Date(Date.now() + this.windowMs);
    }
    
    const oldestRequest = Math.min(...requests);
    return new Date(oldestRequest + this.windowMs);
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter(
  Number(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE) || 100,
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000
);

// Helper to get client IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

// API response helpers
export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}
