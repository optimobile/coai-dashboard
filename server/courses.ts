/**
 * Courses Router - Training Certification Business Model
 * Handles course catalog, enrollments, payment plans, and Stripe subscriptions
 * FREE: Watchdog courses (framework = "watchdog")
 * PAID: CSOAI courses (all other frameworks)
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { courses, courseEnrollments, courseBundles, regions } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Helper function to determine if course is free
const isCourseFreeFn = (framework: string | null) => framework === "watchdog";

export const coursesRouter = router({
  /**
   * Get course catalog with pricing by region
   * Public endpoint - anyone can browse courses
   */
  getCatalog: publicProcedure
    .input(
      z.object({
        regionId: z.number().optional(),
        level: z.enum(["fundamentals", "advanced", "specialist"]).optional(),
        framework: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Build where conditions
      const conditions: any[] = [eq(courses.active, 1)];
      if (input.regionId) {
        conditions.push(eq(courses.regionId, input.regionId));
      }
      if (input.level) {
        conditions.push(eq(courses.level, input.level));
      }
      if (input.framework) {
        conditions.push(eq(courses.framework, input.framework));
      }

      const allCourses = await db
        .select()
        .from(courses)
        .where(and(...conditions));

      return allCourses.map((course: any) => ({
        ...course,
        isFree: isCourseFreeFn(course.framework),
        pricing: {
          oneTime: course.price,
          threeMonth: course.price3Month,
          sixMonth: course.price6Month,
          twelveMonth: course.price12Month,
        },
        stripePriceIds: {
          oneTime: course.stripePriceId,
          threeMonth: course.stripePriceId3Month,
          sixMonth: course.stripePriceId6Month,
          twelveMonth: course.stripePriceId12Month,
        },
      }));
    }),

  /**
   * Get course details with full information
   */
  getCourseDetails: publicProcedure
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

      // Get enrollment count
      const [enrollmentStats] = await db
        .select({ count: sql<number>`count(*)` })
        .from(courseEnrollments)
        .where(eq(courseEnrollments.courseId, input.courseId));

      return {
        ...course,
        isFree: isCourseFreeFn(course.framework),
        enrollmentCount: enrollmentStats?.count || 0,
        pricing: {
          oneTime: course.price,
          threeMonth: course.price3Month,
          sixMonth: course.price6Month,
          twelveMonth: course.price12Month,
        },
        stripePriceIds: {
          oneTime: course.stripePriceId,
          threeMonth: course.stripePriceId3Month,
          sixMonth: course.stripePriceId6Month,
          twelveMonth: course.stripePriceId12Month,
        },
      };
    }),

  /**
   * Get all regions for filtering
   */
  getRegions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(regions);
  }),

  /**
   * Get course bundles with savings calculations
   */
  getCourseBundles: publicProcedure
    .input(z.object({ regionId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Build where conditions
      const conditions: any[] = [eq(courseBundles.active, 1)];
      if (input.regionId) {
        conditions.push(eq(courseBundles.regionId, input.regionId));
      }

      const bundles = await db
        .select()
        .from(courseBundles)
        .where(and(...conditions));

      return bundles.map((bundle: any) => ({
        ...bundle,
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
      }));
    }),

  /**
   * Enroll in a course with payment plan selection
   * FREE courses: Instant enrollment (Watchdog)
   * PAID courses: Creates Stripe checkout session (CSOAI)
   */
  enrollInCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        paymentType: z.enum(["one_time", "3_month", "6_month", "12_month"]).optional(),
        referredBySpecialistId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userId = ctx.user.id;

      // Check if already enrolled
      const [existing] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.userId, userId),
            eq(courseEnrollments.courseId, input.courseId)
          )
        );

      if (existing) {
        throw new Error("Already enrolled in this course");
      }

      // Get course details
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId));

      if (!course) {
        throw new Error("Course not found");
      }

      // FREE COURSES (Watchdog) - Instant enrollment
      if (isCourseFreeFn(course.framework)) {
        const [enrollment] = await db
          .insert(courseEnrollments)
          .values({
            userId,
            courseId: input.courseId,
            status: "enrolled",
            paymentType: "one_time",
            paidAmount: 0,
            subscriptionStatus: "active",
            referredBySpecialistId: input.referredBySpecialistId,
          })
          .$returningId() as { id: number }[];

        return {
          enrollmentId: enrollment.id,
          status: "enrolled",
          isFree: true,
          message: "Successfully enrolled in free course",
        };
      }

      // PAID COURSES (CSOAI) - Stripe payment required
      if (!input.paymentType) {
        throw new Error("Payment type required for paid courses");
      }

      // Map payment type to Stripe price ID
      const paymentTypeMap: Record<string, keyof typeof course> = {
        one_time: "stripePriceId",
        "3_month": "stripePriceId3Month",
        "6_month": "stripePriceId6Month",
        "12_month": "stripePriceId12Month",
      };

      const stripePriceIdKey = paymentTypeMap[input.paymentType];
      const stripePriceId = course[stripePriceIdKey];

      if (!stripePriceId) {
        throw new Error(`Payment plan not available for this course. Please contact support.`);
      }

      // Determine if subscription or one-time
      const isSubscription = input.paymentType !== "one_time";

      try {
        // Create Stripe checkout session
        const session = await (stripe.checkout.sessions.create as any)({
          payment_method_types: ["card"],
          line_items: [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ],
          mode: isSubscription ? "subscription" : "payment",
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/my-courses?success=true&courseId=${input.courseId}`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/courses?cancelled=true`,
          client_reference_id: `${userId}`,
          metadata: {
            courseId: input.courseId.toString(),
            userId: userId.toString(),
            paymentType: input.paymentType,
          },
        });

        // Create enrollment record (pending payment)
        const [enrollment] = await db
          .insert(courseEnrollments)
          .values({
            userId,
            courseId: input.courseId,
            status: "enrolled",
            paymentType: input.paymentType,
            paidAmount: 0,
            stripePaymentIntentId: session.id,
            subscriptionStatus: "none" as any,
            referredBySpecialistId: input.referredBySpecialistId,
          })
          .$returningId() as { id: number }[];

        return {
          enrollmentId: enrollment.id,
          checkoutUrl: session.url,
          paymentType: input.paymentType,
          isFree: false,
          message: "Redirecting to payment...",
        };
      } catch (error: any) {
        throw new Error(`Stripe error: ${error.message}`);
      }
    }),

  /**
   * Get user's enrollments
   */
  getMyEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userId = ctx.user.id;

    const enrollments = await db
      .select({
        enrollment: courseEnrollments,
        course: courses,
      })
      .from(courseEnrollments)
      .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.userId, userId));

    return enrollments.map((row: any) => ({
      ...row.enrollment,
      course: row.course,
      isFree: isCourseFreeFn(row.course?.framework),
    }));
  }),

  /**
   * Get enrollment details
   */
  getEnrollment: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [enrollment] = await db
        .select({
          enrollment: courseEnrollments,
          course: courses,
        })
        .from(courseEnrollments)
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, ctx.user.id)
          )
        );

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      return {
        ...enrollment.enrollment,
        course: enrollment.course,
        isFree: isCourseFreeFn(enrollment.course?.framework ?? null),
      };
    }),

  /**
   * Mark course as completed (after finishing all modules)
   */
  markCourseCompleted: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [enrollment] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, ctx.user.id)
          )
        );

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      // Update enrollment status to completed
      await db
        .update(courseEnrollments)
        .set({
          status: "completed",
          completedAt: new Date().toISOString(),
        })
        .where(eq(courseEnrollments.id, input.enrollmentId));

      return {
        success: true,
        message: "Course marked as completed. You can now take the certification exam.",
      };
    }),

  /**
   * Handle Stripe webhook for payment confirmation
   */
  handleStripeWebhook: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        status: z.enum(["complete", "expired", "open"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.status !== "complete") {
        return { success: false, message: "Payment not completed" };
      }

      // Get Stripe session
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      if (!session.metadata) {
        throw new Error("Invalid session metadata");
      }

      const userId = parseInt(session.metadata.userId);
      const courseId = parseInt(session.metadata.courseId);

      // Update enrollment to active
      await db
        .update(courseEnrollments)
        .set({
          status: "enrolled",
          subscriptionStatus: session.subscription ? "active" : "none",
          stripeSubscriptionId: session.subscription as string,
          paidAmount: session.amount_total || 0,
        })
        .where(
          and(
            eq(courseEnrollments.userId, userId),
            eq(courseEnrollments.courseId, courseId)
          )
        );

      return {
        success: true,
        message: "Payment confirmed. Course access granted.",
      };
    }),

  /**
   * Cancel an enrollment
   */
  cancelEnrollment: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const [enrollment] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, ctx.user.id)
          )
        );

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      // Delete the enrollment
      await db
        .delete(courseEnrollments)
        .where(eq(courseEnrollments.id, input.enrollmentId));

      return { success: true, message: "Enrollment cancelled" };
    }),
});
