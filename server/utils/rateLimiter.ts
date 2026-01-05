/**
 * Simple in-memory rate limiter for TRPC procedures
 * Uses a sliding window approach to limit requests per IP
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Check if a request should be rate limited
   * @param key - Unique identifier (usually IP address or user ID)
   * @returns Object with allowed status and remaining requests
   */
  check(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.cache.get(key);

    // If no entry or window has expired, allow and start new window
    if (!entry || now >= entry.resetAt) {
      this.cache.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetIn: this.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: entry.resetAt - now,
      };
    }

    // Increment count and allow
    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetIn: entry.resetAt - now,
    };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.resetAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Pre-configured rate limiters for different use cases

/**
 * Rate limiter for coupon validation
 * Allows 20 attempts per 15 minutes per IP
 * This prevents brute-force coupon code guessing
 */
export const couponValidationLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20,
});

/**
 * Rate limiter for authentication attempts
 * Allows 5 attempts per 15 minutes per IP
 */
export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * Rate limiter for general API endpoints
 * Allows 100 requests per minute per IP
 */
export const generalApiLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

export { RateLimiter };
