/**
 * CSOAI Stripe Webhook Handler
 * Processes Stripe webhook events for subscription management
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { users, courseEnrollments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { mapSubscriptionStatus, getTierFromPriceId } from "./stripeService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`);
        // Could trigger email notification here
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
        // Could trigger email notification here
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook] Error processing event:`, err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id || session.client_reference_id;
  
  if (!userId) {
    console.error("[Stripe Webhook] No user ID in checkout session");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const courseId = session.metadata?.courseId;
  const paymentType = session.metadata?.paymentType;

  // Check if this is a course enrollment payment
  if (courseId && paymentType) {
    console.log(`[Stripe Webhook] Course enrollment checkout completed for user ${userId}, course: ${courseId}, paymentType: ${paymentType}`);

    // Find the enrollment record
    const [enrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.stripePaymentIntentId, session.id))
      .limit(1);

    if (enrollment) {
      // Update enrollment with payment details
      await db.update(courseEnrollments)
        .set({
          paidAmount: session.amount_total || 0,
          stripeSubscriptionId: subscriptionId || null,
          subscriptionStatus: subscriptionId ? "active" : "none",
          status: "in_progress",
        })
        .where(eq(courseEnrollments.id, enrollment.id));

      console.log(`[Stripe Webhook] Updated enrollment ${enrollment.id} with payment details`);
    }
    return;
  }

  // Otherwise, this is a platform subscription
  const tier = (session.metadata?.tier as "pro" | "enterprise") || "pro";
  console.log(`[Stripe Webhook] Platform subscription checkout completed for user ${userId}, tier: ${tier}`);

  // Update user with Stripe IDs and subscription info
  await db.update(users)
    .set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionTier: tier,
      subscriptionStatus: "active",
    })
    .where(eq(users.id, parseInt(userId)));
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  
  if (!userId) {
    console.error("[Stripe Webhook] No user ID in subscription metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Check if this is a course enrollment subscription
  const [enrollment] = await db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (enrollment) {
    // Update course enrollment subscription status
    const status = subscription.status === "active" ? "active" : 
                   subscription.status === "canceled" ? "cancelled" :
                   subscription.status === "past_due" ? "past_due" : "none";

    console.log(`[Stripe Webhook] Course subscription updated for enrollment ${enrollment.id}: ${status}`);

    await db.update(courseEnrollments)
      .set({
        subscriptionStatus: status,
        status: status === "active" ? "in_progress" : "failed",
      })
      .where(eq(courseEnrollments.id, enrollment.id));
    return;
  }

  // Otherwise, this is a platform subscription
  const status = mapSubscriptionStatus(subscription.status);
  const priceId = subscription.items.data[0]?.price?.id || "";
  const tier = getTierFromPriceId(priceId);

  console.log(`[Stripe Webhook] Platform subscription updated for user ${userId}: ${status}, tier: ${tier}`);

  await db.update(users)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionTier: tier,
      subscriptionStatus: status,
    })
    .where(eq(users.id, parseInt(userId)));
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  
  if (!userId) {
    console.error("[Stripe Webhook] No user ID in subscription metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Check if this is a course enrollment subscription
  const [enrollment] = await db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (enrollment) {
    console.log(`[Stripe Webhook] Course subscription canceled for enrollment ${enrollment.id}`);

    await db.update(courseEnrollments)
      .set({
        subscriptionStatus: "cancelled",
        status: "failed",
      })
      .where(eq(courseEnrollments.id, enrollment.id));
    return;
  }

  // Otherwise, this is a platform subscription
  console.log(`[Stripe Webhook] Platform subscription canceled for user ${userId}`);

  await db.update(users)
    .set({
      subscriptionTier: "free",
      subscriptionStatus: "canceled",
    })
    .where(eq(users.id, parseInt(userId)));
}
