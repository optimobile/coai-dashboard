/**
 * Stripe Webhooks Router
 * Handles Stripe webhook events for payments and subscriptions
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import Stripe from "stripe";
import PaymentService from "../services/paymentService";
import { sendEmail } from "../emailService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const stripeWebhooksRouter = router({
  /**
   * Handle Stripe webhook events
   * This should be called from an Express route handler
   */
  handleWebhook: publicProcedure
    .input(
      z.object({
        body: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error("Webhook secret not configured");
      }

      let event: Stripe.Event;

      try {
        event = PaymentService.verifyWebhookSignature(
          input.body,
          input.signature,
          webhookSecret
        );
      } catch (error) {
        console.error("Webhook signature verification failed:", error);
        throw new Error("Invalid webhook signature");
      }

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case "charge.refunded":
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    }),
});

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout session completed:", session.id);

  if (!session.metadata?.userId || !session.metadata?.courseId) {
    console.error("Invalid session metadata");
    return;
  }

  const userId = parseInt(session.metadata.userId);
  const courseId = parseInt(session.metadata.courseId);
  const paymentType = session.metadata.paymentType as
    | "one_time"
    | "3_month"
    | "6_month"
    | "12_month";

  // Get payment amount
  const amountPaid = session.amount_total || 0;

  try {
    // Update enrollment with payment info
    await PaymentService.handlePaymentSuccess(session.id, amountPaid);

    // Send confirmation email
    const customer = session.customer_details;
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "Payment Received - Course Enrollment Confirmed",
        html: `
          <h2>Payment Confirmed</h2>
          <p>Dear ${customer.name || "Student"},</p>
          <p>Your payment of $${(amountPaid / 100).toFixed(2)} has been received.</p>
          <p>Your course enrollment is now active. You can start learning immediately.</p>
          <p>Payment Type: ${paymentType}</p>
          <p><a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/my-courses">View Your Courses</a></p>
          <p>Best regards,<br/>CSOAI Training Team</p>
        `,
      });
    }
  } catch (error) {
    console.error("Error handling checkout session:", error);
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id);

  if (!invoice.subscription) {
    return;
  }

  try {
    // Update subscription status
    await PaymentService.handleSubscriptionUpdate(
      invoice.subscription.toString(),
      "active"
    );

    // Send receipt email
    if (invoice.customer_email) {
      await sendEmail({
        to: invoice.customer_email,
        subject: "Subscription Payment Received",
        html: `
          <h2>Payment Received</h2>
          <p>Your subscription payment of $${(invoice.amount_paid / 100).toFixed(2)} has been received.</p>
          <p>Invoice: ${invoice.number}</p>
          <p>Next billing date: ${new Date(invoice.next_payment_attempt! * 1000).toLocaleDateString()}</p>
          <p>Best regards,<br/>CSOAI Team</p>
        `,
      });
    }
  } catch (error) {
    console.error("Error handling invoice payment:", error);
  }
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id);

  if (!invoice.subscription) {
    return;
  }

  try {
    // Update subscription status
    await PaymentService.handleSubscriptionUpdate(
      invoice.subscription.toString(),
      "past_due"
    );

    // Send failure notification
    if (invoice.customer_email) {
      await sendEmail({
        to: invoice.customer_email,
        subject: "Payment Failed - Action Required",
        html: `
          <h2>Payment Failed</h2>
          <p>Your subscription payment of $${(invoice.amount_due / 100).toFixed(2)} could not be processed.</p>
          <p>Please update your payment method to continue your subscription.</p>
          <p><a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/billing">Update Payment Method</a></p>
          <p>Best regards,<br/>CSOAI Team</p>
        `,
      });
    }
  } catch (error) {
    console.error("Error handling invoice payment failure:", error);
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);

  try {
    await PaymentService.handleSubscriptionUpdate(subscription.id, subscription.status);
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);

  try {
    await PaymentService.handleSubscriptionUpdate(subscription.id, "canceled");
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("Charge refunded:", charge.id);

  // Send refund notification
  if (charge.receipt_email) {
    try {
      await sendEmail({
        to: charge.receipt_email,
        subject: "Refund Processed",
        html: `
          <h2>Refund Processed</h2>
          <p>A refund of $${(charge.amount_refunded / 100).toFixed(2)} has been processed.</p>
          <p>Charge ID: ${charge.id}</p>
          <p>The refund may take 5-10 business days to appear in your account.</p>
          <p>Best regards,<br/>CSOAI Team</p>
        `,
      });
    } catch (error) {
      console.error("Error sending refund email:", error);
    }
  }
}

export default stripeWebhooksRouter;
