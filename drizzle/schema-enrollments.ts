import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int().autoincrement().notNull(),
  userId: int().notNull(),
  courseId: int(),
  bundleId: int(),
  enrollmentType: varchar({ length: 20 }).notNull(), // 'course' or 'bundle'
  paymentStatus: varchar({ length: 20 }).default('pending').notNull(), // 'pending', 'completed', 'failed', 'free'
  stripePaymentIntentId: varchar({ length: 255 }),
  stripePriceId: varchar({ length: 255 }),
  amountPaid: int().default(0).notNull(),
  couponId: int(),
  enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  completedAt: timestamp({ mode: 'string' }),
});
