/**
 * API Gateway Middleware
 * Handles rate limiting, request throttling, and API key validation
 */

import { Request, Response, NextFunction } from "express";
import { getDb } from "../db";
import { apiKeys } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: Request) => string;
}

interface ApiKeyInfo {
  id: number;
  userId: number;
  tier: "free" | "pro" | "enterprise";
  rateLimit: number;
  isActive: boolean;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : req.ip || "unknown";
    const now = Date.now();

    let record = rateLimitStore.get(key);

    // Create or reset record if window has passed
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, record);
    }

    record.count++;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", config.maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, config.maxRequests - record.count));
    res.setHeader("X-RateLimit-Reset", new Date(record.resetTime).toISOString());

    // Check if limit exceeded
    if (record.count > config.maxRequests) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Max ${config.maxRequests} requests per ${config.windowMs / 1000} seconds`,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}

/**
 * API Key validation middleware
 */
export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "API key is required",
    });
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        error: "Database unavailable",
      });
    }

    // Hash the API key for lookup
    const keyHash = require("crypto").createHash("sha256").update(apiKey).digest("hex");

    const [keyRecord] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyHash, keyHash));

    if (!keyRecord || !keyRecord.isActive) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or inactive API key",
      });
    }

    // Check expiration
    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "API key has expired",
      });
    }

    // Attach key info to request
    (req as any).apiKeyInfo = {
      id: keyRecord.id,
      userId: keyRecord.userId,
      tier: keyRecord.tier,
      rateLimit: keyRecord.rateLimit,
    };

    // Update last used timestamp
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date().toISOString() })
      .where(eq(apiKeys.id, keyRecord.id));

    next();
  } catch (error) {
    console.error("API key validation error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Tier-based rate limiting
 */
export function tierBasedRateLimiter(req: Request, res: Response, next: NextFunction) {
  const apiKeyInfo = (req as any).apiKeyInfo;

  if (!apiKeyInfo) {
    // No API key, use default rate limit
    return createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute for unauthenticated
    })(req, res, next);
  }

  // Use tier-specific rate limits
  const rateLimits: Record<string, { windowMs: number; maxRequests: number }> = {
    free: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
    },
    pro: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 1000, // 1000 requests per minute
    },
    enterprise: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10000, // 10000 requests per minute
    },
  };

  const limit = rateLimits[apiKeyInfo.tier] || rateLimits.free;

  return createRateLimiter({
    ...limit,
    keyGenerator: () => `api-key-${apiKeyInfo.id}`,
  })(req, res, next);
}

/**
 * Request logging middleware
 */
export async function logApiRequest(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const apiKeyInfo = (req as any).apiKeyInfo;

    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: apiKeyInfo?.userId || "anonymous",
      apiKeyId: apiKeyInfo?.id || null,
      ip: req.ip,
    });

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Request validation middleware
 */
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      (req as any).validatedBody = validated;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors || error.message,
      });
    }
  };
}

/**
 * CORS configuration for API
 */
export const apiCorsOptions = {
  origin: [
    "https://csoai.org",
    "https://training.csoai.org",
    "https://council.csoai.org",
    "https://api.csoai.org",
    "https://ceasai.org",
    "https://ceasai.training",
    "https://safetyof.ai",
    "https://councilof.ai",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
};

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  next();
}

export default {
  createRateLimiter,
  validateApiKey,
  tierBasedRateLimiter,
  logApiRequest,
  validateRequest,
  securityHeaders,
};
