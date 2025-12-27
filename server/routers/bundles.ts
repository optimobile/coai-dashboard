/**
 * Bundle Router
 * Handles course bundle queries, pricing, and bundle-specific operations
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { courseBundles, courses, courseEnrollments } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const bundleRouter = router({
  /**
   * Get all course bundles with pricing
   */
  getCourseBundles: publicProcedure
    .input(
      z.object({
        regionId: z.number().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions: any[] = [eq(courseBundles.active, true)];
      if (input.regionId) {
        conditions.push(eq(courseBundles.regionId, input.regionId));
      }

      const bundles = await db
        .select()
        .from(courseBundles)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(courseBundles.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return bundles.map((bundle: any) => ({
        ...bundle,
        courseIds: Array.isArray(bundle.courseIds)
          ? bundle.courseIds
          : JSON.parse(bundle.courseIds || "[]"),
        pricing: {
          oneTime: bundle.bundlePrice,
          threeMonth: bundle.bundlePrice3Month,
          sixMonth: bundle.bundlePrice6Month,
          twelveMonth: bundle.bundlePrice12Month,
        },
        stripePriceIds: {
          oneTime: bundle.stripePriceId,
          threeMonth: bundle.stripePriceId3Month,
          sixMonth: bundle.stripePriceId6Month,
          twelveMonth: bundle.stripePriceId12Month,
        },
        savings: {
          threeMonth: bundle.bundlePrice - (bundle.bundlePrice3Month || bundle.bundlePrice),
          sixMonth: bundle.bundlePrice - (bundle.bundlePrice6Month || bundle.bundlePrice),
          twelveMonth: bundle.bundlePrice - (bundle.bundlePrice12Month || bundle.bundlePrice),
        },
      }));
    }),

  /**
   * Get bundle details with included courses
   */
  getBundleDetails: publicProcedure
    .input(z.object({ bundleId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [bundle] = await db
        .select()
        .from(courseBundles)
        .where(eq(courseBundles.id, input.bundleId));

      if (!bundle) {
        throw new Error("Bundle not found");
      }

      // Parse course IDs
      const courseIds = Array.isArray(bundle.courseIds)
        ? bundle.courseIds
        : JSON.parse(bundle.courseIds || "[]");

      // Get course details
      const bundleCourses = await db
        .select()
        .from(courses)
        .where(sql`${courses.id} IN (${courseIds.join(",")})`);

      // Get enrollment count
      const [enrollmentStats] = await db
        .select({ count: sql<number>`count(*)` })
        .from(courseEnrollments)
        .where(sql`${courseEnrollments.courseId} IN (${courseIds.join(",")})`);

      return {
        ...bundle,
        courseIds,
        courses: bundleCourses,
        enrollmentCount: enrollmentStats?.count || 0,
        pricing: {
          oneTime: bundle.bundlePrice,
          threeMonth: bundle.bundlePrice3Month,
          sixMonth: bundle.bundlePrice6Month,
          twelveMonth: bundle.bundlePrice12Month,
        },
        stripePriceIds: {
          oneTime: bundle.stripePriceId,
          threeMonth: bundle.stripePriceId3Month,
          sixMonth: bundle.stripePriceId6Month,
          twelveMonth: bundle.stripePriceId12Month,
        },
        savings: {
          threeMonth: bundle.bundlePrice - (bundle.bundlePrice3Month || bundle.bundlePrice),
          sixMonth: bundle.bundlePrice - (bundle.bundlePrice6Month || bundle.bundlePrice),
          twelveMonth: bundle.bundlePrice - (bundle.bundlePrice12Month || bundle.bundlePrice),
        },
      };
    }),

  /**
   * Calculate savings for a bundle
   */
  calculateBundleSavings: publicProcedure
    .input(
      z.object({
        courseIds: z.array(z.number()),
        paymentType: z.enum(["one_time", "3_month", "6_month", "12_month"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get course prices
      const selectedCourses = await db
        .select()
        .from(courses)
        .where(sql`${courses.id} IN (${input.courseIds.join(",")})`);

      // Calculate individual course cost
      let individualCost = 0;
      let bundleCost = 0;

      switch (input.paymentType) {
        case "3_month":
          individualCost = selectedCourses.reduce(
            (sum, c) => sum + (c.price3Month || c.price),
            0
          );
          break;
        case "6_month":
          individualCost = selectedCourses.reduce(
            (sum, c) => sum + (c.price6Month || c.price),
            0
          );
          break;
        case "12_month":
          individualCost = selectedCourses.reduce(
            (sum, c) => sum + (c.price12Month || c.price),
            0
          );
          break;
        default:
          individualCost = selectedCourses.reduce((sum, c) => sum + c.price, 0);
      }

      // Find matching bundle
      const [matchingBundle] = await db
        .select()
        .from(courseBundles)
        .where(eq(courseBundles.active, true));

      if (matchingBundle) {
        switch (input.paymentType) {
          case "3_month":
            bundleCost = matchingBundle.bundlePrice3Month || matchingBundle.bundlePrice;
            break;
          case "6_month":
            bundleCost = matchingBundle.bundlePrice6Month || matchingBundle.bundlePrice;
            break;
          case "12_month":
            bundleCost = matchingBundle.bundlePrice12Month || matchingBundle.bundlePrice;
            break;
          default:
            bundleCost = matchingBundle.bundlePrice;
        }
      }

      const savings = Math.max(0, individualCost - bundleCost);
      const savingsPercent = individualCost > 0 ? Math.round((savings / individualCost) * 100) : 0;

      return {
        individualCost,
        bundleCost: bundleCost || individualCost,
        savings,
        savingsPercent,
        courseCount: selectedCourses.length,
      };
    }),

  /**
   * Get course pricing for different payment types
   */
  getCoursePricing: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId));

      if (!course) {
        throw new Error("Course not found");
      }

      return {
        courseId: course.id,
        courseName: course.title,
        pricing: {
          oneTime: {
            amount: course.price,
            stripePriceId: course.stripePriceId,
            currency: "USD",
          },
          threeMonth: {
            amount: course.price3Month || course.price,
            stripePriceId: course.stripePriceId3Month,
            currency: "USD",
            monthlyAmount: Math.round((course.price3Month || course.price) / 3),
          },
          sixMonth: {
            amount: course.price6Month || course.price,
            stripePriceId: course.stripePriceId6Month,
            currency: "USD",
            monthlyAmount: Math.round((course.price6Month || course.price) / 6),
          },
          twelveMonth: {
            amount: course.price12Month || course.price,
            stripePriceId: course.stripePriceId12Month,
            currency: "USD",
            monthlyAmount: Math.round((course.price12Month || course.price) / 12),
          },
        },
        savings: {
          threeMonth: Math.max(0, course.price * 3 - (course.price3Month || course.price * 3)),
          sixMonth: Math.max(0, course.price * 6 - (course.price6Month || course.price * 6)),
          twelveMonth: Math.max(0, course.price * 12 - (course.price12Month || course.price * 12)),
        },
      };
    }),

  /**
   * Get user's bundle enrollments
   */
  getMyBundleEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userId = ctx.user.id;

    // Get all enrollments for this user
    const enrollments = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId));

    // Group by bundle
    const bundleEnrollments: Record<string, any> = {};

    for (const enrollment of enrollments) {
      // Find bundle containing this course
      const [bundle] = await db
        .select()
        .from(courseBundles)
        .where(
          sql`JSON_CONTAINS(${courseBundles.courseIds}, JSON_ARRAY(${enrollment.courseId}))`
        );

      if (bundle) {
        if (!bundleEnrollments[bundle.id]) {
          bundleEnrollments[bundle.id] = {
            ...bundle,
            enrollments: [],
          };
        }
        bundleEnrollments[bundle.id].enrollments.push(enrollment);
      }
    }

    return Object.values(bundleEnrollments);
  }),

  /**
   * Get bundle statistics
   */
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const bundles = await db
      .select()
      .from(courseBundles)
      .where(eq(courseBundles.active, true));

    const stats = {
      totalBundles: bundles.length,
      totalEnrollments: 0,
      averagePrice: 0,
      highestSavings: 0,
    };

    if (bundles.length > 0) {
      stats.averagePrice = Math.round(
        bundles.reduce((sum, b) => sum + b.bundlePrice, 0) / bundles.length
      );

      stats.highestSavings = Math.max(...bundles.map((b) => b.savings || 0));

      // Count total enrollments
      for (const bundle of bundles) {
        const courseIds = Array.isArray(bundle.courseIds)
          ? bundle.courseIds
          : JSON.parse(bundle.courseIds || "[]");

        const [enrollmentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(courseEnrollments)
          .where(sql`${courseEnrollments.courseId} IN (${courseIds.join(",")})`);

        stats.totalEnrollments += enrollmentCount?.count || 0;
      }
    }

    return stats;
  }),
});

export default bundleRouter;
