/**
 * Payment Service
 * Handles Stripe payment processing, subscriptions, and webhooks
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { courseEnrollments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export interface PaymentSessionResult {
  sessionId: string;
  checkoutUrl: string;
  paymentType: "one_time" | "3_month" | "6_month" | "12_month";
}

export interface SubscriptionResult {
  subscriptionId: string;
  status: "active" | "pending" | "past_due";
  currentPeriodEnd: Date;
}

export class PaymentService {
  /**
   * Create a checkout session for one-time or subscription payment
   */
  static async createCheckoutSession(
    userId: number,
    courseId: number,
    stripePriceId: string,
    paymentType: "one_time" | "3_month" | "6_month" | "12_month",
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentSessionResult> {
    const mode = paymentType === "one_time" ? "payment" : "subscription";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: `${userId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
        paymentType,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
      paymentType,
    };
  }

  /**
   * Handle successful payment - update enrollment record
   */
  static async handlePaymentSuccess(
    sessionId: string,
    paidAmount: number
  ): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get the session to extract metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.courseId || !session.metadata?.userId) {
      throw new Error("Invalid session metadata");
    }

    const userId = parseInt(session.metadata.userId);
    const courseId = parseInt(session.metadata.courseId);
    const paymentType = session.metadata.paymentType as
      | "one_time"
      | "3_month"
      | "6_month"
      | "12_month";

    // Find or create enrollment
    const [enrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(
        eq(courseEnrollments.stripePaymentIntentId, sessionId)
      );

    if (enrollment) {
      // Update existing enrollment
      await db
        .update(courseEnrollments)
        .set({
          status: "in_progress",
          paidAmount,
          stripePaymentIntentId: session.subscription
            ? session.subscription.toString()
            : sessionId,
          subscriptionStatus: session.subscription ? "active" : "none",
        })
        .where(eq(courseEnrollments.id, enrollment.id));
    } else {
      // Create new enrollment
      await db.insert(courseEnrollments).values({
        userId,
        courseId,
        status: "in_progress",
        paymentType,
        paidAmount,
        stripePaymentIntentId: session.subscription
          ? session.subscription.toString()
          : sessionId,
        subscriptionStatus: session.subscription ? "active" : "none",
      });
    }
  }

  /**
   * Handle subscription update (e.g., payment succeeded, subscription renewed)
   */
  static async handleSubscriptionUpdate(
    subscriptionId: string,
    status: string
  ): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Find enrollment by subscription ID
    const [enrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.stripeSubscriptionId, subscriptionId));

    if (enrollment) {
      let subscriptionStatus: "active" | "cancelled" | "past_due" | "none" =
        "none";

      if (status === "active") {
        subscriptionStatus = "active";
      } else if (status === "past_due") {
        subscriptionStatus = "past_due";
      } else if (status === "canceled") {
        subscriptionStatus = "cancelled";
      }

      // Get the latest invoice amount
      const latestInvoice = subscription.latest_invoice;
      let paidAmount = enrollment.paidAmount;

      if (
        latestInvoice &&
        typeof latestInvoice === "object" &&
        latestInvoice.amount_paid
      ) {
        paidAmount = latestInvoice.amount_paid;
      }

      await db
        .update(courseEnrollments)
        .set({
          subscriptionStatus,
          paidAmount,
          stripeSubscriptionId: subscriptionId,
        })
        .where(eq(courseEnrollments.id, enrollment.id));
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    await stripe.subscriptions.cancel(subscriptionId);

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Update enrollment status
    const [enrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.stripeSubscriptionId, subscriptionId));

    if (enrollment) {
      await db
        .update(courseEnrollments)
        .set({
          status: "failed",
          subscriptionStatus: "cancelled",
        })
        .where(eq(courseEnrollments.id, enrollment.id));
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscriptionDetails(
    subscriptionId: string
  ): Promise<SubscriptionResult> {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const statusMap: Record<string, "active" | "pending" | "past_due"> = {
      active: "active",
      past_due: "past_due",
      trialing: "active",
      incomplete: "pending",
      incomplete_expired: "pending",
      paused: "pending",
    };

    return {
      subscriptionId: subscription.id,
      status: (statusMap[subscription.status] || "pending") as
        | "active"
        | "pending"
        | "past_due",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
  }

  /**
   * Refund a payment
   */
  static async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<string> {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });

    return refund.id;
  }

  /**
   * Get payment intent details
   */
  static async getPaymentIntentDetails(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      currency: paymentIntent.currency,
      created: new Date(paymentIntent.created * 1000),
    };
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(body, signature, secret);
  }
}

export default PaymentService;
