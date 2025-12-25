/**
 * Courses Router - Training Certification Business Model
 * Handles course catalog, enrollments, payment plans, and Stripe subscriptions
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { courses, courseEnrollments, courseBundles, regions } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

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
      const conditions: any[] = [eq(courses.active, true)];
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
   * Get course bundles with savings calculations
   */
  getCourseBundles: publicProcedure
    .input(z.object({ regionId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Build where conditions
      const conditions: any[] = [eq(courseBundles.active, true)];
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
   * Creates Stripe subscription for payment plans
   */
  enrollInCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        paymentType: z.enum(["one_time", "3_month", "6_month", "12_month"]),
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

      // Determine price and Stripe price ID based on payment type
      let price: number;
      let stripePriceId: string | null;

      switch (input.paymentType) {
        case "one_time":
          price = course.price;
          stripePriceId = course.stripePriceId;
          break;
        case "3_month":
          price = course.price3Month || course.price;
          stripePriceId = course.stripePriceId3Month;
          break;
        case "6_month":
          price = course.price6Month || course.price;
          stripePriceId = course.stripePriceId6Month;
          break;
        case "12_month":
          price = course.price12Month || course.price;
          stripePriceId = course.stripePriceId12Month;
          break;
      }

      if (!stripePriceId) {
        throw new Error("Payment plan not available for this course");
      }

      // Create Stripe checkout session
      let stripeSubscriptionId: string | null = null;
      let subscriptionStatus: "active" | "cancelled" | "past_due" | "none" = "none";

      if (input.paymentType === "one_time") {
        // One-time payment
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/my-courses?success=true`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/training?cancelled=true`,
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
            paidAmount: 0, // Will be updated by webhook
            stripePaymentIntentId: session.id,
            subscriptionStatus: "none",
            referredBySpecialistId: input.referredBySpecialistId,
          })
          .$returningId();

        return {
          enrollmentId: enrollment.id,
          checkoutUrl: session.url,
          paymentType: input.paymentType,
        };
      } else {
        // Subscription payment plan
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/my-courses?success=true`,
          cancel_url: `${process.env.VITE_FRONTEND_FORGE_API_URL}/training?cancelled=true`,
          client_reference_id: `${userId}`,
          metadata: {
            courseId: input.courseId.toString(),
            userId: userId.toString(),
            paymentType: input.paymentType,
          },
        });

        // Create enrollment record (pending first payment)
        const [enrollment] = await db
          .insert(courseEnrollments)
          .values({
            userId,
            courseId: input.courseId,
            status: "enrolled",
            paymentType: input.paymentType,
            paidAmount: 0, // Will be updated by webhook
            stripePaymentIntentId: session.id,
            subscriptionStatus: "active",
            referredBySpecialistId: input.referredBySpecialistId,
          })
          .$returningId();

        return {
          enrollmentId: enrollment.id,
          checkoutUrl: session.url,
          paymentType: input.paymentType,
        };
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
    }));
  }),

  /**
   * Cancel enrollment and subscription
   */
  cancelEnrollment: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userId = ctx.user.id;

      // Get enrollment
      const [enrollment] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, userId)
          )
        );

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      // Cancel Stripe subscription if exists
      if (enrollment.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(enrollment.stripeSubscriptionId);
      }

      // Update enrollment status
      await db
        .update(courseEnrollments)
        .set({
          status: "failed",
          subscriptionStatus: "cancelled",
        })
        .where(eq(courseEnrollments.id, input.enrollmentId));

      return { success: true };
    }),

  /**
   * Get course progress
   */
  getCourseProgress: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userId = ctx.user.id;

      const [enrollment] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, userId)
          )
        );

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      return {
        progress: enrollment.progress,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        score: enrollment.score,
      };
    }),

  /**
   * Generate course certificate for completed enrollment
   */
  generateCourseCertificate: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get enrollment with course details
      const [enrollment] = await db
        .select({
          id: courseEnrollments.id,
          userId: courseEnrollments.userId,
          courseId: courseEnrollments.courseId,
          status: courseEnrollments.status,
          completedAt: courseEnrollments.completedAt,
          courseTitle: courses.title,
          courseLevel: courses.level,
          courseFramework: courses.framework,
          courseDuration: courses.durationHours,
        })
        .from(courseEnrollments)
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(
          and(
            eq(courseEnrollments.id, input.enrollmentId),
            eq(courseEnrollments.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      if (enrollment.status !== "completed") {
        throw new Error("Course must be completed to generate certificate");
      }

      // Generate certificate URL (placeholder - would integrate with PDF generation service)
      const certificateUrl = `/api/certificates/${enrollment.id}.pdf`;

      return {
        certificateUrl,
        enrollment: {
          id: enrollment.id,
          courseTitle: enrollment.courseTitle,
          completedAt: enrollment.completedAt,
          level: enrollment.courseLevel,
          framework: enrollment.courseFramework,
        },
      };
    }),

  /**
   * Get regions for filtering courses
   */
  getRegions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return await db.select().from(regions).where(eq(regions.active, true));
  }),
});
