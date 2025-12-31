import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { generateBadgePackage, generateBadgeSVG, convertSVGToPNG } from "../services/badge-generator";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { certificationBadges, users } from "../../drizzle/schema";

export const certificationBadgesRouter = router({
  /**
   * Generate a new certification badge for a user
   */
  generateBadge: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        certificationLevel: z.enum(["level_1", "level_2", "level_3", "expert"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Get user info
        const user = await db.query.users.findFirst({
          where: eq(users.id, input.userId),
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Generate badge package
        const badgePackage = generateBadgePackage({
          userId: input.userId,
          userName: user.name || `User ${input.userId}`,
          certificationLevel: input.certificationLevel,
          issueDate: new Date().toISOString(),
        });

        // Store in database
        const result = await db.insert(certificationBadges).values({
          userId: input.userId,
          certificationLevel: input.certificationLevel,
          badgeToken: badgePackage.badgeToken,
          badgeImageUrl: badgePackage.badgeImageUrl,
          badgeEmbedCode: badgePackage.badgeEmbedCode,
          verificationUrl: badgePackage.verificationUrl,
          issuedAt: new Date().toISOString(),
          shareCount: 0,
          clickCount: 0,
          linkedInShares: 0,
        });

        return {
          success: true,
          badge: badgePackage,
          databaseId: result[0]?.insertId || 0,
        };
      } catch (error) {
        console.error("Error generating badge:", error);
        throw new Error("Failed to generate certification badge");
      }
    }),

  /**
   * Get badge details by token
   */
  getBadgeByToken: publicProcedure
    .input(z.object({ badgeToken: z.string() }))
    .query(async ({ input }) => {
      try {
        const badge = await db.query.certificationBadges.findFirst({
          where: eq(certificationBadges.badgeToken, input.badgeToken),
        });

        if (!badge) {
          throw new Error("Badge not found");
        }

        // Get user info
        const user = await db.query.users.findFirst({
          where: eq(users.id, badge.userId),
        });

        // Increment click count
        await db
          .update(certificationBadges)
          .set({ clickCount: (badge.clickCount || 0) + 1 })
          .where(eq(certificationBadges.badgeToken, input.badgeToken));

        return {
          badge,
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
          },
        };
      } catch (error) {
        console.error("Error fetching badge:", error);
        throw new Error("Badge not found");
      }
    }),

  /**
   * Get all badges for a user
   */
  getUserBadges: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      try {
        const badges = await db.query.certificationBadges.findMany({
          where: eq(certificationBadges.userId, input.userId),
        });

        return badges;
      } catch (error) {
        console.error("Error fetching user badges:", error);
        throw new Error("Failed to fetch badges");
      }
    }),

  /**
   * Track badge share
   */
  trackShare: publicProcedure
    .input(
      z.object({
        badgeToken: z.string(),
        platform: z.enum(["linkedin", "twitter", "email"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const badge = await db.query.certificationBadges.findFirst({
          where: eq(certificationBadges.badgeToken, input.badgeToken),
        });

        if (!badge) {
          throw new Error("Badge not found");
        }

        // Update share counts
        const updates: any = {
          shareCount: (badge.shareCount || 0) + 1,
        };

        if (input.platform === "linkedin") {
          updates.linkedInShares = (badge.linkedInShares || 0) + 1;
        }

        await db
          .update(certificationBadges)
          .set(updates)
          .where(eq(certificationBadges.badgeToken, input.badgeToken));

        return { success: true };
      } catch (error) {
        console.error("Error tracking share:", error);
        throw new Error("Failed to track share");
      }
    }),

  /**
   * Get badge statistics
   */
  getBadgeStats: publicProcedure
    .input(z.object({ badgeToken: z.string() }))
    .query(async ({ input }) => {
      try {
        const badge = await db.query.certificationBadges.findFirst({
          where: eq(certificationBadges.badgeToken, input.badgeToken),
        });

        if (!badge) {
          throw new Error("Badge not found");
        }

        return {
          totalShares: badge.shareCount || 0,
          totalClicks: badge.clickCount || 0,
          linkedInShares: badge.linkedInShares || 0,
          issuedAt: badge.issuedAt,
          certificationLevel: badge.certificationLevel,
        };
      } catch (error) {
        console.error("Error fetching badge stats:", error);
        throw new Error("Failed to fetch badge statistics");
      }
    }),

  /**
   * Get badge image as PNG
   * This would typically be handled by a separate API endpoint
   */
  getBadgeImage: publicProcedure
    .input(z.object({ badgeToken: z.string() }))
    .query(async ({ input }) => {
      try {
        const badge = await db.query.certificationBadges.findFirst({
          where: eq(certificationBadges.badgeToken, input.badgeToken),
        });

        if (!badge) {
          throw new Error("Badge not found");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.id, badge.userId),
        });

        const svgString = generateBadgeSVG(
          user?.name || `User ${badge.userId}`,
          badge.certificationLevel
        );

        // Return SVG directly (PNG conversion would happen in the API route)
        return {
          svg: svgString,
          contentType: "image/svg+xml",
        };
      } catch (error) {
        console.error("Error generating badge image:", error);
        throw new Error("Failed to generate badge image");
      }
    }),
});
