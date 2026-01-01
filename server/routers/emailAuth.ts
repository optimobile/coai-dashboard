import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { router, publicProcedure } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

// Rate limiting map (in-memory, resets on server restart)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const SALT_ROUNDS = 12;

function checkRateLimit(email: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (attempt) {
    if (now > attempt.resetAt) {
      // Reset window
      loginAttempts.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    } else if (attempt.count >= MAX_ATTEMPTS) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many login attempts. Please try again in 15 minutes.",
      });
    } else {
      attempt.count++;
    }
  } else {
    loginAttempts.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }
}

function resetRateLimit(email: string): void {
  loginAttempts.delete(email);
}

export const emailAuthRouter = router({
  /**
   * Register new user with email/password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
          ),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Generate unique openId for email auth users
      const openId = `email_${crypto.randomBytes(16).toString("hex")}`;

      // Create user
      const userId = await db.createUser({
        openId,
        email,
        password: passwordHash,
        name,
        loginMethod: "email",
        role: "user",
      });

      return {
        success: true,
        message: "Account created successfully",
        userId,
      };
    }),

  /**
   * Login with email/password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Check rate limit
      checkRateLimit(email);

      // Get user by email
      const user = await db.getUserByEmail(email);
      if (!user || !user.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Reset rate limit on successful login
      resetRateLimit(email);

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      // Set session cookie (using existing session mechanism)
      // Note: This needs to be integrated with the existing session management
      // For now, return user info and let the frontend handle session

      return {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  /**
   * Request password reset
   */
  requestReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      // Get user by email
      const user = await db.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent",
        };
      }

      // Generate reset token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in database
      await db.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt: expiresAt.toISOString(),
      });

      // TODO: Send email with reset link
      // For now, just return success
      console.log(
        `[EmailAuth] Password reset token for ${email}: ${token}`
      );

      return {
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent",
        // TEMPORARY: Include token in response for testing (REMOVE IN PRODUCTION)
        token: process.env.NODE_ENV === "development" ? token : undefined,
      };
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Token is required"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
          ),
      })
    )
    .mutation(async ({ input }) => {
      const { token, newPassword } = input;

      // Get token from database
      const resetToken = await db.getPasswordResetToken(token);
      if (!resetToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset token",
        });
      }

      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(resetToken.expiresAt);
      if (now > expiresAt) {
        await db.deletePasswordResetToken(resetToken.id);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset token has expired",
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update user password
      await db.updateUserPassword(resetToken.userId, passwordHash);

      // Delete used token
      await db.deletePasswordResetToken(resetToken.id);

      return {
        success: true,
        message: "Password reset successfully",
      };
    }),
});
